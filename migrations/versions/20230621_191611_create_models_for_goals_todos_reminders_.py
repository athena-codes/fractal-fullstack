"""Create models for Goals, Todos, Reminders, DailyPlanner, and DailyPlannerSlots

Revision ID: b98529268de6
Revises: 4e5e7301c54a
Create Date: 2023-06-21 19:16:11.126293

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = 'b98529268de6'
down_revision = '4e5e7301c54a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('daily_planner',
                    sa.Column('user_id', sa.Integer(), sa.ForeignKey(
                        'users.id'), nullable=False),
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('date', sa.Date(), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=True),
                    sa.Column('updated_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_table('goals',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), sa.ForeignKey(
                        'users.id'), nullable=False),
                    sa.Column('title', sa.String(), nullable=False),
                    sa.Column('end_date', sa.Date(), nullable=True),
                    sa.Column('timeframe', sa.Integer(), nullable=False),
                    sa.Column('description', sa.String(), nullable=True),
                    sa.Column('comments', sa.String(), nullable=True),
                    sa.Column('progress', sa.Numeric(
                        precision=5, scale=2), nullable=True),
                    sa.Column('created_at', sa.DateTime(), nullable=True),
                    sa.Column('updated_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id'),
                    )
    op.create_table('todos',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), sa.ForeignKey(
                        'users.id'), nullable=False),
                    sa.Column('name', sa.String(), nullable=False),
                    sa.Column('priority', sa.Integer(), nullable=True),
                    sa.Column('description', sa.String(), nullable=True),
                    sa.Column('notes', sa.String(), nullable=True),
                    sa.Column('reminder', sa.Boolean(), nullable=True),
                    sa.Column('completed', sa.Boolean(), nullable=True),
                    sa.Column('goal_id', sa.Integer(), nullable=True),
                    sa.Column('created_at', sa.DateTime(), nullable=True),
                    sa.Column('updated_at', sa.DateTime(), nullable=True),
                    sa.ForeignKeyConstraint(['goal_id'], ['goals.id']),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_table('daily_planner_slots',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), sa.ForeignKey(
                        'users.id'), nullable=False),
                    sa.Column('start_time', sa.Time(), nullable=True),
                    sa.Column('end_time', sa.Time(), nullable=True),
                    sa.Column('daily_planner_id',
                              sa.Integer(), nullable=False),
                    sa.Column('todo_id', sa.Integer(), nullable=True),
                    sa.Column('created_at', sa.DateTime(), nullable=True),
                    sa.Column('updated_at', sa.DateTime(), nullable=True),
                    sa.ForeignKeyConstraint(['daily_planner_id'], [
                                            'daily_planner.id']),
                    sa.ForeignKeyConstraint(['todo_id'], ['todos.id']),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_table('reminders',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), sa.ForeignKey(
                        'users.id'), nullable=False),
                    sa.Column('todo_id', sa.Integer(), nullable=True),
                    sa.Column('created_at', sa.DateTime(), nullable=True),
                    sa.Column('updated_at', sa.DateTime(), nullable=True),
                    sa.ForeignKeyConstraint(['todo_id'], ['todos.id']),
                    sa.PrimaryKeyConstraint('id')
                    )

    op.create_table('notes',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), sa.ForeignKey(
                        'users.id'), nullable=False),
                    sa.Column('title', sa.String(), nullable=True),
                    sa.Column('content', sa.String(), nullable=True),
                    sa.Column('created_at', sa.DateTime(), nullable=True),
                    sa.Column('updated_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id')
                    )

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('daily_planner')
    op.drop_table('goals')
    op.drop_table('todos')
    op.drop_table('daily_planner_slots')
    op.drop_table('reminders')
    op.drop_table('notes')
    # ### end Alembic commands ###
