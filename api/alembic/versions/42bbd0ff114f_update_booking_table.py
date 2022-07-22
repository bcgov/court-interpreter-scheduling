"""update_booking_table

Revision ID: 42bbd0ff114f
Revises: a336b85ed740
Create Date: 2022-05-10 08:54:24.486799

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '42bbd0ff114f'
down_revision = 'a336b85ed740'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('booking_dates', sa.Column('bilingual', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('booking_dates', 'bilingual')
    # ### end Alembic commands ###