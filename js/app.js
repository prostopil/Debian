import { loadContent } from './content.js';
import { initializeDB, saveProgress, getProgress, saveContent, getContent } from './storage.js';

let currentSection = 0;
let sections = [];
let isEditing = false;
let editor = null;

async function init() {
  await initializeDB();
  
  try {
    // Try to load saved content first
    const savedSections = await getContent();
    if (savedSections && savedSections.length > 0) {
      sections = savedSections;
    } else {
      // If no saved content, load default and save it
      sections = await loadContent();
      await saveContent(sections);
    }
    
    renderNavigation();
    renderContent();
    updateProgress();
    
    const savedProgress = await getProgress();
    if (savedProgress) {
      currentSection = savedProgress.currentSection;
      renderContent();
    }

    setupEventListeners();
    hljs.highlightAll();
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

function setupEventListeners() {
  document.getElementById('prevBtn').addEventListener('click', previousSection);
  document.getElementById('nextBtn').addEventListener('click', nextSection);
  document.getElementById('editBtn').addEventListener('click', toggleEdit);
  document.getElementById('saveBtn').addEventListener('click', saveEdit);
  document.getElementById('deleteBtn').addEventListener('click', deleteSection);
  document.getElementById('addSectionBtn').addEventListener('click', showAddSectionModal);
  document.getElementById('saveSectionBtn').addEventListener('click', saveNewSection);
  document.getElementById('cancelSectionBtn').addEventListener('click', hideAddSectionModal);
}

async function toggleEdit() {
  isEditing = !isEditing;
  const content = document.getElementById('content');
  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  const sectionElement = content.querySelector('.section');

  if (isEditing) {
    content.classList.add('editing');
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    
    const editorData = sections[currentSection].content;
    
    // Initialize CKEditor
    try {
      editor = await ClassicEditor.create(sectionElement, {
        removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload'],
      });
      editor.setData(editorData);
    } catch (error) {
      console.error(error);
    }
  } else {
    content.classList.remove('editing');
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    
    if (editor) {
      editor.destroy();
      editor = null;
    }
  }
}

async function saveEdit() {
  if (editor) {
    const content = editor.getData();
    sections[currentSection].content = content;
    try {
      await saveContent(sections);
      await toggleEdit();
      renderContent();
    } catch (error) {
      console.error('Error saving edit:', error);
      alert('Ошибка при сохранении изменений. Пожалуйста, попробуйте снова.');
    }
  }
}

async function deleteSection() {
  if (confirm('Вы уверены, что хотите удалить этот раздел?')) {
    sections.splice(currentSection, 1);
    await saveContent(sections);
    
    if (currentSection >= sections.length) {
      currentSection = Math.max(0, sections.length - 1);
    }
    
    renderNavigation();
    renderContent();
    updateProgress();
  }
}

async function showAddSectionModal() {
  const modal = document.getElementById('addSectionModal');
  const contentElement = document.getElementById('newSectionContent');
  modal.style.display = 'block';
  
  try {
    if (editor) {
      editor.destroy();
    }
    
    editor = await ClassicEditor.create(contentElement, {
      removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload'],
    });
  } catch (error) {
    console.error('Error initializing editor:', error);
    alert('Ошибка при инициализации редактора. Пожалуйста, обновите страницу и попробуйте снова.');
  }
}

function hideAddSectionModal() {
  const modal = document.getElementById('addSectionModal');
  modal.style.display = 'none';
  if (editor) {
    editor.destroy();
    editor = null;
  }
}

async function saveNewSection() {
  const title = document.getElementById('newSectionTitle').value;
  const content = editor ? editor.getData() : '';
  
  if (title && content) {
    sections.push({ title, content });
    try {
      await saveContent(sections);
      hideAddSectionModal();
      renderNavigation();
      currentSection = sections.length - 1;
      renderContent();
    } catch (error) {
      console.error('Error saving new section:', error);
      alert('Ошибка при сохранении раздела. Пожалуйста, попробуйте снова.');
    }
  } else {
    alert('Пожалуйста, заполните все поля');
  }
}

function renderNavigation() {
  const nav = document.getElementById('navigation');
  nav.innerHTML = sections.map((section, index) => `
    <div class="nav-item ${index === currentSection ? 'active' : ''}" 
         data-index="${index}"
         onclick="window.selectSection(${index})">
      ${section.title}
    </div>
  `).join('');
}

function renderContent() {
  const content = document.getElementById('content');
  const section = sections[currentSection];
  
  content.innerHTML = `
    <div class="section">
      <h2>${section.title}</h2>
      ${section.content}
    </div>
  `;
  
  updateButtons();
  updateProgress();
  hljs.highlightAll();
}

function updateButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  prevBtn.disabled = currentSection === 0;
  nextBtn.disabled = currentSection === sections.length - 1;
}

function updateProgress() {
  const progress = ((currentSection + 1) / sections.length) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${Math.round(progress)}%`;
}

function previousSection() {
  if (currentSection > 0) {
    currentSection--;
    saveProgress({ currentSection });
    renderContent();
    renderNavigation();
  }
}

function nextSection() {
  if (currentSection < sections.length - 1) {
    currentSection++;
    saveProgress({ currentSection });
    renderContent();
    renderNavigation();
  }
}

window.selectSection = (index) => {
  currentSection = index;
  saveProgress({ currentSection });
  renderContent();
  renderNavigation();
};

init();