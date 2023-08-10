from flask import Blueprint, jsonify, request
from flask_login import current_user
from datetime import datetime
from flask_login import login_required
from app.models import Note, db
from app.forms import NoteForm

note_routes = Blueprint('notes', __name__)

# Create new note
@note_routes.route('/', methods=['POST'])
@login_required
def create_note():
    form = NoteForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        content = form.content.data
        title = form.title.data

        user_id = current_user.id

        note = Note(user_id=user_id, content=content, title=title)

        db.session.add(note)
        db.session.commit()

        return jsonify(note.to_dict()), 200
    else:
        errors = form.errors
        return jsonify(errors), 400


# Get details of specific note
@note_routes.route('/<note_id>', methods=['GET'])
@login_required
def get_note(note_id):
    note = Note.query.get(note_id)

    if not note:
        return jsonify({'message': 'Note not found'}), 404

    if note.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 401

    return jsonify(note.to_dict()), 200



# Update a specific note
@note_routes.route('/<note_id>', methods=['PUT'])
@login_required
def update_note(note_id):
    note = Note.query.get(note_id)

    if not note:
        return jsonify({'message': 'Note not found'}), 404

    if note.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.get_json()
    note.content = data.get('content')
    note.title = data.get('title')

    db.session.commit()

    return jsonify(note.to_dict()), 200


# Delete a note
@note_routes.route('/<note_id>', methods=['DELETE'])
@login_required
def delete_note(note_id):
    note = Note.query.get(note_id)

    if note:
        if note.user_id != current_user.id:
            return jsonify({'message': 'Unauthorized'}), 401

    if not note:
        return jsonify({'message': 'Note not found'}), 404

    db.session.delete(note)
    db.session.commit()

    return jsonify({'message': 'Note deleted successfully'}), 200


# Get all notes for the current user
@note_routes.route('/', methods=['GET'])
@login_required
def get_all_notes():
    user_id = current_user.id
    notes = Note.query.filter_by(user_id=user_id).all()

    if not notes:
        return jsonify({'message': 'No goals found'}), 404

    notes_data = [note.to_dict() for note in notes]

    return jsonify(notes_data), 200
