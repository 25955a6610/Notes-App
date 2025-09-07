const noteInput = document.getElementById('noteInput');
    const addBtn = document.getElementById('addBtn');
    const notesList = document.getElementById('notesList');
    const searchInput = document.getElementById('searchInput');
    const darkToggle = document.getElementById('darkToggle');

    function loadNotes() {
      const notes = localStorage.getItem('notesData');
      return notes ? JSON.parse(notes) : [];
    }

    function saveNotes(notes) {
      localStorage.setItem('notesData', JSON.stringify(notes));
    }

    function displayNotes(filter = '') {
      let notes = loadNotes();
      if (filter) {
        notes = notes.filter(n => n.text.toLowerCase().includes(filter.toLowerCase()));
      }
      // Pinned notes first
      notesList.innerHTML = '';
      const pinned = notes.filter(n => n.pinned);
      const normal = notes.filter(n => !n.pinned);
      [...pinned, ...normal].forEach((note, index) => {
        const li = document.createElement('li');
        if (note.pinned) li.classList.add('pinned');

        const textSpan = document.createElement('span');
        textSpan.textContent = note.text;
        textSpan.className = 'note-text';

        const btns = document.createElement('div');
        btns.className = 'btns';

        const pinBtn = document.createElement('button');
        pinBtn.textContent = note.pinned ? 'Unpin' : 'Pin';
        pinBtn.className = 'pin';
        pinBtn.addEventListener('click', () => {
          togglePin(index, filter);
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Modify';
        editBtn.className = 'edit';
        editBtn.addEventListener('click', () => {
          editNote(index, filter);
        });

        const delBtSn = document.createElement('button');
        delBtn.textContent = 'Wipe OUT';
        delBtn.addEventListener('click', () => {
          deleteNote(index, filter);
        });

        btns.appendChild(pinBtn);
        btns.appendChild(editBtn);
        btns.appendChild(delBtn);

        li.appendChild(textSpan);
        li.appendChild(btns);
        notesList.appendChild(li);
      });
    }

    function addNote() {
      const noteText = noteInput.value.trim();
      if (noteText !== '') {
        const notes = loadNotes();
        notes.push({ text: noteText, pinned: false });
        saveNotes(notes);
        noteInput.value = '';
        displayNotes(searchInput.value);
      }
    }

    function deleteNote(index, filter) {
      let notes = loadNotes();
      const actualIndex = getActualIndex(index, filter);
      notes.splice(actualIndex, 1);
      saveNotes(notes);
      displayNotes(searchInput.value);
    }

    function editNote(index, filter) {
      let notes = loadNotes();
      const actualIndex = getActualIndex(index, filter);
      const newText = prompt('Modify Your Freed', notes[actualIndex].text);
      if (newText !== null && newText.trim() !== '') {
        notes[actualIndex].text = newText.trim();
        saveNotes(notes);
        displayNotes(searchInput.value);
      }
    }

    function togglePin(index, filter) {
      let notes = loadNotes();
      const actualIndex = getActualIndex(index, filter);
      notes[actualIndex].pinned = !notes[actualIndex].pinned;
      saveNotes(notes);
      displayNotes(searchInput.value);
    }

    function getActualIndex(filteredIndex, filter) {
      let notes = loadNotes();
      if (filter) {
        let filtered = notes.filter(n => n.text.toLowerCase().includes(filter.toLowerCase()));
        const note = filtered[filteredIndex];
        return notes.findIndex(n => n.text === note.text && n.pinned === note.pinned);
      }
      return filteredIndex;
    }

    addBtn.addEventListener('click', addNote);
    noteInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addNote();
      }
    });
    searchInput.addEventListener('input', () => {
      displayNotes(searchInput.value);
    });

    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });

    displayNotes();