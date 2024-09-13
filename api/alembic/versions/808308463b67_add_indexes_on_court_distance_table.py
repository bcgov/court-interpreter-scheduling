"""Add indexes on court_distance table for court_id, interpreter_id fields

Revision ID: 808308463b67
Revises: c12c24a7b8f8
Create Date: 2024-09-08 19:45:13.687850

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '808308463b67'
down_revision = 'c12c24a7b8f8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index(op.f('ix_court_distance_court_id'), 'court_distance', ['court_id'], unique=False)
    op.create_index(op.f('ix_court_distance_interpreter_id'), 'court_distance', ['interpreter_id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_court_distance_interpreter_id'), table_name='court_distance')
    op.drop_index(op.f('ix_court_distance_court_id'), table_name='court_distance')
    # ### end Alembic commands ###