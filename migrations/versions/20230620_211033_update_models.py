"""Update models

Revision ID: ffd025b4cc79
Revises: e43adf0dada7
Create Date: 2023-06-20 21:10:33.069586

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = 'ffd025b4cc79'
down_revision = 'e43adf0dada7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('created_at', existing_type=sa.DateTime(
        ), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'))
        batch_op.alter_column('updated_at', existing_type=sa.DateTime(
        ), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('created_at', existing_type=sa.DateTime(
        ), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'))
        batch_op.alter_column('updated_at', existing_type=sa.DateTime(
        ), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'))

    # ### end Alembic commands ###
