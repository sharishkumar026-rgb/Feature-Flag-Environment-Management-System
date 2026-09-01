from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    require_admin,
)

from app.database.database import get_db

from app.models.user import User

from app.schemas.user_assignment import (
    AssignmentCreate,
    AssignmentUpdate,
    AssignmentCreateResponse,
    AssignmentListResponse,
    AssignmentSingleResponse,
    AssignmentUpdateResponse,
    AssignmentDeleteResponse,
)

from app.services.user_assignment_service import (
    UserAssignmentService,
)


router = APIRouter(
    prefix="/assignments",
    tags=["User Assignments"],
)


# ============================================================
# GET ALL ASSIGNMENTS
# Admin + User
#
# Admin -> sees all assignments
# User  -> sees only own assignments
# ============================================================

@router.get(
    "",
    response_model=AssignmentListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all assignments",
)
def get_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return UserAssignmentService.get_all(
        db=db,
        current_user=current_user,
    )


# ============================================================
# GET ASSIGNMENT BY ID
# Admin + User
#
# Admin -> can see any assignment
# User  -> can see only own assignment
# ============================================================

@router.get(
    "/{assignment_id}",
    response_model=AssignmentSingleResponse,
    status_code=status.HTTP_200_OK,
    summary="Get assignment by ID",
)
def get_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return UserAssignmentService.get_by_id(
        db=db,
        assignment_id=assignment_id,
        current_user=current_user,
    )


# ============================================================
# CREATE ASSIGNMENT
# Admin only
# ============================================================

@router.post(
    "",
    response_model=AssignmentCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create assignment",
)
def create_assignment(
    data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return UserAssignmentService.create(
        db=db,
        data=data,
        current_user=current_user,
    )


# ============================================================
# UPDATE ASSIGNMENT
# Admin only
# ============================================================

@router.put(
    "/{assignment_id}",
    response_model=AssignmentUpdateResponse,
    status_code=status.HTTP_200_OK,
    summary="Update assignment",
)
def update_assignment(
    assignment_id: int,
    data: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return UserAssignmentService.update(
        db=db,
        assignment_id=assignment_id,
        data=data,
        current_user=current_user,
    )


# ============================================================
# DELETE ASSIGNMENT
# Admin only
# ============================================================

@router.delete(
    "/{assignment_id}",
    response_model=AssignmentDeleteResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete assignment",
)
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return UserAssignmentService.delete(
        db=db,
        assignment_id=assignment_id,
        current_user=current_user,
    )
