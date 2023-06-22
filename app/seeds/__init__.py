from flask.cli import AppGroup
from .users import seed_users, undo_users
from .goals import seed_goals, undo_goals
from .to_dos import seed_todos, undo_todos
from .reminders import seed_reminders, undo_reminders
from .daily_planners import seed_daily_planners, undo_daily_planners
from .daily_planner_slots import seed_daily_planner_slots, undo_daily_planner_slots

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        undo_users()
        undo_goals()
        undo_todos()
        undo_reminders()
        undo_daily_planners()
        undo_daily_planner_slots()
    seed_users()
    seed_goals()
    seed_todos()
    seed_reminders()
    seed_daily_planners()
    seed_daily_planner_slots()


@seed_commands.command('undo')
def undo():
    undo_users()
    undo_goals()
    undo_todos()
    undo_reminders()
    undo_daily_planners()
    undo_daily_planner_slots()
