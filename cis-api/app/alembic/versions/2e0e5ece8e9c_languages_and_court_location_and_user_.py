"""languages and court location and user management

Revision ID: 2e0e5ece8e9c
Revises: 
Create Date: 2021-11-16 13:37:58.826854

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import orm
from sqlalchemy.dialects import postgresql
from app.core.utils import read_json, get_seeds_dir

# revision identifiers, used by Alembic.
from app.models.cis import LanguageModel

revision = '2e0e5ece8e9c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('court_location',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('location_name', sa.String(), nullable=False),
    sa.Column('location_code', sa.String(), nullable=False),
    sa.Column('address_line1', sa.String(), nullable=True),
    sa.Column('address_line2', sa.String(), nullable=True),
    sa.Column('city', sa.String(), nullable=True),
    sa.Column('postal_code', sa.String(), nullable=True),
    sa.Column('location_short_desc', sa.String(), nullable=False),
    sa.Column('lat', sa.Float(), nullable=True),
    sa.Column('lng', sa.Float(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('location_code')
    )
    op.create_index(op.f('ix_court_location_id'), 'court_location', ['id'], unique=False)
    op.create_index(op.f('ix_court_location_location_name'), 'court_location', ['location_name'], unique=True)
    op.create_table('language',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_language_id'), 'language', ['id'], unique=False)
    op.create_index(op.f('ix_language_name'), 'language', ['name'], unique=True)
    op.create_table('role',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('role_name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_role_id'), 'role', ['id'], unique=False)
    op.create_index(op.f('ix_role_role_name'), 'role', ['role_name'], unique=True)
    op.create_table('user',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('gu_id', sa.String(), nullable=False),
    sa.Column('kc_id', sa.String(), nullable=True),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('disabled', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_gu_id'), 'user', ['gu_id'], unique=True)
    op.create_index(op.f('ix_user_id'), 'user', ['id'], unique=False)
    op.create_index(op.f('ix_user_kc_id'), 'user', ['kc_id'], unique=True)
    op.create_table('user_role',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('role_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_role_id'), 'user_role', ['id'], unique=False)

    # migrate our seed data
    migrate_data()


def downgrade():
    op.drop_index(op.f('ix_user_role_id'), table_name='user_role')
    op.drop_table('user_role')
    op.drop_index(op.f('ix_user_kc_id'), table_name='user')
    op.drop_index(op.f('ix_user_id'), table_name='user')
    op.drop_index(op.f('ix_user_gu_id'), table_name='user')
    op.drop_table('user')
    op.drop_index(op.f('ix_role_role_name'), table_name='role')
    op.drop_index(op.f('ix_role_id'), table_name='role')
    op.drop_table('role')
    op.drop_index(op.f('ix_language_name'), table_name='language')
    op.drop_index(op.f('ix_language_id'), table_name='language')
    op.drop_table('language')
    op.drop_index(op.f('ix_court_location_location_name'), table_name='court_location')
    op.drop_index(op.f('ix_court_location_id'), table_name='court_location')
    op.drop_table('court_location')


def migrate_data():
    print('running data migration')
    bind = op.get_bind()
    session = orm.Session(bind=bind)
    seeds = read_json(get_seeds_dir(__file__) + 'languages.json')
    print('\tmigrating data for languages')
    seeds.sort(key=lambda x: x.get('name'))
    for seed in seeds:
        m = LanguageModel(name=seed.get('name'))
        session.add(m)
    session.commit()
