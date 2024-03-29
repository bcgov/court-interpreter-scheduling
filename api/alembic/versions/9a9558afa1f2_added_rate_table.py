"""added_rate_table

Revision ID: 9a9558afa1f2
Revises: ab3b04d5f223
Create Date: 2022-04-25 11:29:35.423579

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9a9558afa1f2'
down_revision = 'ab3b04d5f223'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    rate_table = op.create_table('rate',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_by', sa.String(), nullable=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('value', sa.Float(), nullable=True),
        sa.Column('previous_value', sa.Float(), nullable=True),
        sa.Column('value_changed_date', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_rate_id'), 'rate', ['id'], unique=False)
    # op.create_unique_constraint('court_location_name_key', 'court_location', ['name'])
    # ### end Alembic commands ###
    op.bulk_insert(rate_table, [
        {'name':'SPKL1','value':'63.16','previous_value':'63.16','updated_by':'System'}, 
        {'name':'SPKL2','value':'55.8','previous_value':'55.8','updated_by':'System'},
        {'name':'SPKL3','value':'37.94','previous_value':'37.94','updated_by':'System'},
        {'name':'SPKL4','value':'37.94','previous_value':'37.94','updated_by':'System'},
        {'name':'ASL1', 'value':'84.21','previous_value':'84.21','updated_by':'System'},
        {'name':'ASL2', 'value':'55.8','previous_value':'55.8','updated_by':'System'},
        {'name':'CART', 'value':'112.35','previous_value':'112.35','updated_by':'System'},
        {'name':'MILEAGE','value':'0.55','previous_value':'0.55','updated_by':'System'},
        {'name':'BREAKFAST','value':'12.75','previous_value':'12.75','updated_by':'System'},
        {'name':'LUNCH','value':'14.75','previous_value':'14.75','updated_by':'System'},
        {'name':'DINNER','value':'25.50','previous_value':'25.50','updated_by':'System'},        
        {'name':'LODGING','value':'152.22','previous_value':'152.22','updated_by':'System'},
        {'name':'TRAVEL_HOUR','value':'0.0','previous_value':'0.0','updated_by':'System'}    
    ])



def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_constraint('court_location_name_key', 'court_location', type_='unique')
    op.drop_index(op.f('ix_rate_id'), table_name='rate')
    op.drop_table('rate')
    # ### end Alembic commands ###
