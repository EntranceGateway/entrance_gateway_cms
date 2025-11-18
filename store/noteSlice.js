import { createSlice } from "@reduxjs/toolkit";
import STATUSES from '../src/globals/status/statuses'
import API from '../src/http'

const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        data: null,       
        status: null,
        token:null
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload;
        },
        setData(state, action) {
            state.data = action.payload;
        },
        updateNoteInState(state, action) {
            const updatedNote = action.payload;
            state.data = state.data.map(note => 
                note.id === updatedNote.id ? updatedNote : note
            );
        },
        removeNoteFromState(state, action) {
            const id = action.payload;
            state.data = state.data.filter(note => note.id !== id);
        }
    }
});

export const { setStatus, setData, updateNoteInState, removeNoteFromState } = notesSlice.actions;
export default notesSlice.reducer;

// Add note
export function addNotes(data) {
    return async function(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.post('notes', data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.status === 201) {
                dispatch(setStatus(STATUSES.SUCCESS));
            } else {
                dispatch(setStatus(STATUSES.ERROR));
            }
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR));
        }
    }
}

// Fetch notes
export function fetchNotes() {
    return async function(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get('notes');
            if (response.status === 200 && response.data.notes) {
                dispatch(setData(response.data.notes));
                dispatch(setStatus(STATUSES.SUCCESS));
            } else {
                dispatch(setStatus(STATUSES.ERROR));
            }
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR));
        }
    }
}

// Delete note
export function deleteNotes(id, token) {
    return async function(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.delete(`notes/${id}`, {
                headers: { token }
            });
            if (response.status === 200) {
                dispatch(removeNoteFromState(id)); // remove from state
                dispatch(setStatus(STATUSES.SUCCESS));
            } else {
                dispatch(setStatus(STATUSES.ERROR));
            }
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR));
        }
    }
}

// Update note
export function updateNotes(id, data, token) {
    return async function(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.put(`notes/${id}`, data, {
                headers: { token, "Content-Type": "multipart/form-data" }
            });
            if (response.status === 200 && response.data.note) {
                dispatch(updateNoteInState(response.data.note)); // update in state
                dispatch(setStatus(STATUSES.SUCCESS));
            } else {
                dispatch(setStatus(STATUSES.ERROR));
            }
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR));
        }
    }
}
