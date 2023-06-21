"""empty message

Revision ID: e43adf0dada7
Revises: ffdc0a98111c
Create Date: 2023-06-20 20:30:53.650157

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = 'e43adf0dada7'
down_revision = 'ffdc0a98111c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('full_name', sa.String(length=100), nullable=False))
        batch_op.add_column(sa.Column('password', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('profile_picture_url', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('dark_mode_enabled', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=False))
        batch_op.drop_column('hashed_password')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hashed_password', sa.VARCHAR(length=255), nullable=False))
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('dark_mode_enabled')
        batch_op.drop_column('profile_picture_url')
        batch_op.drop_column('password')
        batch_op.drop_column('full_name')

    # ### end Alembic commands ###
