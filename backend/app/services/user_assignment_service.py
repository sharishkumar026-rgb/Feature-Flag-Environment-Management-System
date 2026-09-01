
from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.user_assignment import UserAssignment
from app.models.user import User
from app.models.feature_flag import FeatureFlag

from app.schemas.user_assignment import (
    AssignmentCreate,
    AssignmentUpdate,
)


class UserAssignmentService:

    # ============================================================
    # GET ALL ASSIGNMENTS
    # Admin -> Can see all assignments
    # User  -> Can see only own assignments
    # ============================================================

    @staticmethod
    def get_all(
        db: Session,
        current_user: User
    ):

        # --------------------------------------------------------
        # GET ASSIGNMENTS WITH RELATIONSHIPS
        # --------------------------------------------------------

        query = (
            db.query(UserAssignment)
            .options(
                joinedload(UserAssignment.user)
                .joinedload(User.role),

                joinedload(UserAssignment.assigned_by)
                .joinedload(User.role),

                joinedload(UserAssignment.feature)
            )
        )

        # --------------------------------------------------------
        # USER CAN SEE ONLY OWN ASSIGNMENTS
        # --------------------------------------------------------

        if current_user.role.name.lower() != "admin":

            query = query.filter(
                UserAssignment.user_id == current_user.id
            )

        # --------------------------------------------------------
        # GET ASSIGNMENTS
        # --------------------------------------------------------

        assignments = (
            query
            .order_by(UserAssignment.id.asc())
            .all()
        )

        # --------------------------------------------------------
        # RELOAD CURRENT USER WITH ROLE
        # --------------------------------------------------------

        current_user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == current_user.id
            )
            .first()
        )

        # --------------------------------------------------------
        # RESPONSE
        # --------------------------------------------------------

        return {
            "success": True,

            "message": (
                "Assignments retrieved successfully by Admin"
                if current_user.role.name.lower() == "admin"
                else "Assignments retrieved successfully by User"
            ),

            "total": len(assignments),

            "assignments": assignments,

            "retrieved_by": {
                "user": current_user
            }
        }

    # ============================================================
    # GET ASSIGNMENT BY ID
    # Admin -> Can see any assignment
    # User  -> Can see only own assignment
    # ============================================================

    @staticmethod
    def get_by_id(
        db: Session,
        assignment_id: int,
        current_user: User
    ):

        # --------------------------------------------------------
        # GET ASSIGNMENT WITH RELATIONSHIPS
        # --------------------------------------------------------

        assignment = (
            db.query(UserAssignment)
            .options(
                joinedload(UserAssignment.user)
                .joinedload(User.role),

                joinedload(UserAssignment.assigned_by)
                .joinedload(User.role),

                joinedload(UserAssignment.feature)
            )
            .filter(
                UserAssignment.id == assignment_id
            )
            .first()
        )

        # --------------------------------------------------------
        # CHECK ASSIGNMENT
        # --------------------------------------------------------

        if not assignment:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found"
            )

        # --------------------------------------------------------
        # USER CAN ACCESS ONLY OWN ASSIGNMENT
        # --------------------------------------------------------

        if (
            current_user.role.name.lower() != "admin"
            and assignment.user_id != current_user.id
        ):

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can access only your own assignment"
            )

        # --------------------------------------------------------
        # RELOAD CURRENT USER WITH ROLE
        # --------------------------------------------------------

        current_user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == current_user.id
            )
            .first()
        )

        # --------------------------------------------------------
        # RESPONSE
        # --------------------------------------------------------

        return {
            "success": True,

            "message": (
                "Assignment retrieved successfully by Admin"
                if current_user.role.name.lower() == "admin"
                else "Assignment retrieved successfully by User"
            ),

            "assignment": assignment,

            "retrieved_by": {
                "user": current_user
            }
        }

    # ============================================================
    # CREATE ASSIGNMENT
    # Admin only
    # ============================================================

    @staticmethod
    def create(
        db: Session,
        data: AssignmentCreate,
        current_user: User
    ):

        # --------------------------------------------------------
        # CHECK USER
        # --------------------------------------------------------

        user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == data.user_id
            )
            .first()
        )

        if not user:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # --------------------------------------------------------
        # CHECK FEATURE
        # --------------------------------------------------------

        feature = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.id == data.feature_id
            )
            .first()
        )

        if not feature:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature not found"
            )

        # --------------------------------------------------------
        # CHECK DUPLICATE
        # --------------------------------------------------------

        existing = (
            db.query(UserAssignment)
            .filter(
                UserAssignment.user_id == data.user_id,
                UserAssignment.feature_id == data.feature_id
            )
            .first()
        )

        if existing:

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Feature is already assigned to this user"
            )

        # --------------------------------------------------------
        # CREATE ASSIGNMENT
        # --------------------------------------------------------

        assignment = UserAssignment(
            user_id=data.user_id,
            feature_id=data.feature_id,

            # Admin who assigned the feature
            assigned_by_id=current_user.id,

            is_enabled=data.is_enabled,

            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.add(assignment)

        db.commit()

        db.refresh(assignment)

        # --------------------------------------------------------
        # RELOAD ASSIGNMENT WITH ALL RELATIONSHIPS
        # --------------------------------------------------------

        assignment = (
            db.query(UserAssignment)
            .options(
                joinedload(UserAssignment.user)
                .joinedload(User.role),

                joinedload(UserAssignment.assigned_by)
                .joinedload(User.role),

                joinedload(UserAssignment.feature)
            )
            .filter(
                UserAssignment.id == assignment.id
            )
            .first()
        )

        # --------------------------------------------------------
        # RELOAD CURRENT ADMIN
        # --------------------------------------------------------

        current_user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == current_user.id
            )
            .first()
        )

        # --------------------------------------------------------
        # RESPONSE
        # --------------------------------------------------------

        return {
            "success": True,

            "message": "Feature assigned to user successfully by Admin",

            "assignment": assignment,

            "assigned_by": {
                "user": current_user
            }
        }

    # ============================================================
    # UPDATE ASSIGNMENT
    # Admin only
    # ============================================================

    @staticmethod
    def update(
        db: Session,
        assignment_id: int,
        data: AssignmentUpdate,
        current_user: User
    ):

        # --------------------------------------------------------
        # GET ASSIGNMENT
        # --------------------------------------------------------

        assignment = (
            db.query(UserAssignment)
            .options(
                joinedload(UserAssignment.user)
                .joinedload(User.role),

                joinedload(UserAssignment.assigned_by)
                .joinedload(User.role),

                joinedload(UserAssignment.feature)
            )
            .filter(
                UserAssignment.id == assignment_id
            )
            .first()
        )

        if not assignment:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found"
            )

        # --------------------------------------------------------
        # GET UPDATE DATA
        # --------------------------------------------------------

        update_data = data.model_dump(
            exclude_unset=True
        )

        # --------------------------------------------------------
        # NEW USER ID
        # --------------------------------------------------------

        new_user_id = update_data.get(
            "user_id",
            assignment.user_id
        )

        # --------------------------------------------------------
        # NEW FEATURE ID
        # --------------------------------------------------------

        new_feature_id = update_data.get(
            "feature_id",
            assignment.feature_id
        )

        # --------------------------------------------------------
        # CHECK USER
        # --------------------------------------------------------

        if "user_id" in update_data:

            user = (
                db.query(User)
                .filter(
                    User.id == new_user_id
                )
                .first()
            )

            if not user:

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

        # --------------------------------------------------------
        # CHECK FEATURE
        # --------------------------------------------------------

        if "feature_id" in update_data:

            feature = (
                db.query(FeatureFlag)
                .filter(
                    FeatureFlag.id == new_feature_id
                )
                .first()
            )

            if not feature:

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Feature not found"
                )

        # --------------------------------------------------------
        # CHECK DUPLICATE
        # --------------------------------------------------------

        existing = (
            db.query(UserAssignment)
            .filter(
                UserAssignment.user_id == new_user_id,
                UserAssignment.feature_id == new_feature_id,
                UserAssignment.id != assignment_id
            )
            .first()
        )

        if existing:

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Feature is already assigned to this user"
            )

        # --------------------------------------------------------
        # UPDATE ASSIGNMENT
        # --------------------------------------------------------

        for field, value in update_data.items():

            setattr(
                assignment,
                field,
                value
            )

        # --------------------------------------------------------
        # UPDATE TIMESTAMP
        # --------------------------------------------------------

        assignment.updated_at = datetime.utcnow()

        db.commit()

        db.refresh(assignment)

        # --------------------------------------------------------
        # RELOAD ASSIGNMENT WITH RELATIONSHIPS
        # --------------------------------------------------------

        assignment = (
            db.query(UserAssignment)
            .options(
                joinedload(UserAssignment.user)
                .joinedload(User.role),

                joinedload(UserAssignment.assigned_by)
                .joinedload(User.role),

                joinedload(UserAssignment.feature)
            )
            .filter(
                UserAssignment.id == assignment_id
            )
            .first()
        )

        # --------------------------------------------------------
        # RELOAD CURRENT ADMIN
        # --------------------------------------------------------

        current_user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == current_user.id
            )
            .first()
        )

        # --------------------------------------------------------
        # RESPONSE
        # --------------------------------------------------------

        return {
            "success": True,

            "message": "Assignment updated successfully by Admin",

            "assignment": assignment,

            "updated_by": {
                "user": current_user
            }
        }

    # ============================================================
    # DELETE ASSIGNMENT
    # Admin only
    # ============================================================

    @staticmethod
    def delete(
        db: Session,
        assignment_id: int,
        current_user: User
    ):

        # --------------------------------------------------------
        # GET ASSIGNMENT
        # --------------------------------------------------------

        assignment = (
            db.query(UserAssignment)
            .options(
                joinedload(UserAssignment.user)
                .joinedload(User.role),

                joinedload(UserAssignment.assigned_by)
                .joinedload(User.role),

                joinedload(UserAssignment.feature)
            )
            .filter(
                UserAssignment.id == assignment_id
            )
            .first()
        )

        if not assignment:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found"
            )

        # --------------------------------------------------------
        # SAVE RESPONSE OBJECT
        # --------------------------------------------------------

        response_assignment = assignment

        # --------------------------------------------------------
        # RELOAD CURRENT ADMIN
        # --------------------------------------------------------

        current_user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == current_user.id
            )
            .first()
        )

        # --------------------------------------------------------
        # DELETE
        # --------------------------------------------------------

        db.delete(assignment)

        db.commit()

        # --------------------------------------------------------
        # RESPONSE
        # --------------------------------------------------------

        return {
            "success": True,

            "message": "Assignment deleted successfully by Admin",

            "assignment": response_assignment,

            "deleted_by": {
                "user": current_user
            }
        }



