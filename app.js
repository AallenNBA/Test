// NBA Venue Tracker App
class VenueTracker {
    constructor() {
        this.currentVenue = 'state-farm-arena';
        this.cameras = [];
        this.selectedCameraId = null;
        this.selectedCameraType = 'broadcast-camera';
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromStorage();
        this.addDefaultCamera();
        this.render();
    }

    setupEventListeners() {
        // Venue selection
        document.getElementById('venueSelect').addEventListener('change', (e) => {
            this.currentVenue = e.target.value;
            this.save();
        });

        // Quick add buttons
        document.getElementById('addCamera').addEventListener('click', () => this.addCamera());
        document.getElementById('addVenue').addEventListener('click', () => this.showVenueModal());
        document.getElementById('addAnnounce').addEventListener('click', () => this.addAnnounceTable());

        // Camera type selection
        document.querySelectorAll('.camera-icon-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.camera-icon-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedCameraType = btn.dataset.type;
            });
        });

        // Settings tabs
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabName = tab.dataset.tab;
                document.getElementById('settingsPanel').style.display = tabName === 'settings' ? 'block' : 'none';
                document.getElementById('measurementsPanel').style.display = tabName === 'measurements' ? 'block' : 'none';
            });
        });

        // Settings controls
        document.getElementById('iconType').addEventListener('change', (e) => {
            if (this.selectedCameraId !== null) {
                this.cameras[this.selectedCameraId].type = e.target.value;
                this.save();
                this.render();
            }
        });

        document.getElementById('bgColor').addEventListener('change', (e) => {
            if (this.selectedCameraId !== null) {
                this.cameras[this.selectedCameraId].bgColor = e.target.value;
                this.save();
                this.render();
            }
        });

        document.getElementById('iconColor').addEventListener('change', (e) => {
            if (this.selectedCameraId !== null) {
                this.cameras[this.selectedCameraId].iconColor = e.target.value;
                this.save();
                this.render();
            }
        });

        document.getElementById('sizeSlider').addEventListener('input', (e) => {
            if (this.selectedCameraId !== null) {
                this.cameras[this.selectedCameraId].size = parseInt(e.target.value);
                document.getElementById('sizeValue').textContent = e.target.value + ' px';
                this.save();
                this.render();
            }
        });

        document.getElementById('rotationSlider').addEventListener('input', (e) => {
            if (this.selectedCameraId !== null) {
                this.cameras[this.selectedCameraId].rotation = parseInt(e.target.value);
                document.getElementById('rotationValue').textContent = e.target.value + '°';
                this.save();
                this.render();
            }
        });

        document.getElementById('labelSizeSlider').addEventListener('input', (e) => {
            if (this.selectedCameraId !== null) {
                this.cameras[this.selectedCameraId].labelSize = parseInt(e.target.value);
                document.getElementById('labelSizeValue').textContent = e.target.value + ' px';
                this.save();
                this.render();
            }
        });

        document.getElementById('opacitySlider').addEventListener('input', (e) => {
            if (this.selectedCameraId !== null) {
                this.cameras[this.selectedCameraId].opacity = parseInt(e.target.value);
                document.getElementById('opacityValue').textContent = e.target.value + '%';
                this.save();
                this.render();
            }
        });

        document.getElementById('labelTitle').addEventListener('change', (e) => {
            if (this.selectedCameraId !== null) {
                this.cameras[this.selectedCameraId].title = e.target.value;
                this.save();
                this.render();
            }
        });

        document.getElementById('positionNotes').addEventListener('change', (e) => {
            if (this.selectedCameraId !== null) {
                this.cameras[this.selectedCameraId].notes = e.target.value;
                this.save();
            }
        });

        document.querySelector('.delete-btn').addEventListener('click', () => this.deleteSelectedCamera());
        document.querySelector('.duplicate-btn').addEventListener('click', () => this.duplicateSelectedCamera());
        document.querySelector('.remove-all-btn').addEventListener('click', () => this.removeAllCameras());

        // Map container for clicking
        document.getElementById('mapContainer').addEventListener('click', (e) => {
            if (e.target.id === 'camerasLayer' || e.target.id === 'mapContainer') {
                const rect = document.getElementById('camerasLayer').getBoundingClientRect();
                const x = (e.clientX - rect.left) / this.zoom;
                const y = (e.clientY - rect.top) / this.zoom;
                this.addCameraAtPosition(x, y);
            }
        });

        // Zoom controls
        document.querySelectorAll('.zoom-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.textContent === '+') {
                    this.zoom = Math.min(3, this.zoom + 0.1);
                } else {
                    this.zoom = Math.max(0.5, this.zoom - 0.1);
                }
                document.querySelector('.zoom-level').textContent = Math.round(this.zoom * 100) + '%';
                this.updateMapScale();
            });
        });
    }

    addDefaultCamera() {
        if (this.cameras.length === 0) {
            this.cameras.push({
                id: 'camera-' + Date.now(),
                type: 'broadcast-camera',
                x: 400,
                y: 300,
                size: 44,
                bgColor: '#e63946',
                iconColor: '#ffffff',
                rotation: 0,
                labelSize: 14,
                opacity: 80,
                title: 'Mid-Level Center Court',
                subtitle: 'Play-by-Play',
                notes: 'Primary play-by-play camera position. Clean center court angle.'
            });
        }
    }

    addCamera() {
        this.addCameraAtPosition(400, 300);
    }

    addCameraAtPosition(x, y) {
        const camera = {
            id: 'camera-' + Date.now(),
            type: this.selectedCameraType,
            x: x,
            y: y,
            size: 44,
            bgColor: '#e63946',
            iconColor: '#ffffff',
            rotation: 0,
            labelSize: 14,
            opacity: 80,
            title: 'New Camera',
            subtitle: 'New Position',
            notes: ''
        };
        this.cameras.push(camera);
        this.selectedCameraId = this.cameras.length - 1;
        this.save();
        this.render();
    }

    selectCamera(id) {
        this.selectedCameraId = id;
        this.updateSettingsPanel();
        this.render();
    }

    updateSettingsPanel() {
        if (this.selectedCameraId !== null && this.cameras[this.selectedCameraId]) {
            const camera = this.cameras[this.selectedCameraId];
            document.getElementById('iconType').value = camera.type;
            document.getElementById('bgColor').value = camera.bgColor;
            document.getElementById('iconColor').value = camera.iconColor;
            document.getElementById('sizeSlider').value = camera.size;
            document.getElementById('sizeValue').textContent = camera.size + ' px';
            document.getElementById('rotationSlider').value = camera.rotation;
            document.getElementById('rotationValue').textContent = camera.rotation + '°';
            document.getElementById('labelSizeSlider').value = camera.labelSize;
            document.getElementById('labelSizeValue').textContent = camera.labelSize + ' px';
            document.getElementById('opacitySlider').value = camera.opacity;
            document.getElementById('opacityValue').textContent = camera.opacity + '%';
            document.getElementById('labelTitle').value = camera.title;
            document.getElementById('positionNotes').value = camera.notes;
            document.getElementById('selectedTitle').textContent = camera.title;
            document.getElementById('selectedSubtitle').textContent = camera.subtitle;
        }
    }

    deleteSelectedCamera() {
        if (this.selectedCameraId !== null) {
            this.cameras.splice(this.selectedCameraId, 1);
            this.selectedCameraId = this.cameras.length > 0 ? 0 : null;
            this.save();
            this.render();
        }
    }

    duplicateSelectedCamera() {
        if (this.selectedCameraId !== null) {
            const original = this.cameras[this.selectedCameraId];
            const duplicate = { ...original, id: 'camera-' + Date.now(), x: original.x + 20, y: original.y + 20 };
            this.cameras.push(duplicate);
            this.selectedCameraId = this.cameras.length - 1;
            this.save();
            this.render();
        }
    }

    removeAllCameras() {
        if (confirm('Remove all cameras?')) {
            this.cameras = [];
            this.selectedCameraId = null;
            this.save();
            this.render();
        }
    }

    addAnnounceTable() {
        this.selectedCameraType = 'announce-table';
        this.addCamera();
    }

    showVenueModal() {
        alert('Add new venue feature coming soon!');
    }

    updateMapScale() {
        const camerasLayer = document.getElementById('camerasLayer');
        camerasLayer.style.transform = `scale(${this.zoom})`;
        camerasLayer.style.transformOrigin = '0 0';
    }

    render() {
        const camerasLayer = document.getElementById('camerasLayer');
        camerasLayer.innerHTML = '';

        this.cameras.forEach((camera, index) => {
            const element = document.createElement('div');
            element.className = 'camera-icon' + (index === this.selectedCameraId ? ' selected' : '');
            element.style.left = camera.x + 'px';
            element.style.top = camera.y + 'px';
            element.style.transform = `translate(-50%, -50%) rotate(${camera.rotation}deg)`;
            element.style.pointerEvents = 'auto';
            element.dataset.index = index;

            const circle = document.createElement('div');
            circle.style.width = camera.size + 'px';
            circle.style.height = camera.size + 'px';
            circle.style.backgroundColor = camera.bgColor;
            circle.style.borderRadius = '50%';
            circle.style.display = 'flex';
            circle.style.alignItems = 'center';
            circle.style.justifyContent = 'center';
            circle.style.fontSize = (camera.size * 0.6) + 'px';
            circle.style.opacity = (camera.opacity / 100);
            circle.style.cursor = 'grab';

            const icons = {
                'broadcast-camera': '📷',
                'handheld-camera': '🎥',
                'headset': '🎧',
                'announce-table': '📢'
            };

            const icon = document.createElement('span');
            icon.textContent = icons[camera.type] || '📷';
            icon.style.color = camera.iconColor;
            circle.appendChild(icon);

            const label = document.createElement('div');
            label.textContent = camera.title;
            label.style.position = 'absolute';
            label.style.top = (camera.size / 2 + 10) + 'px';
            label.style.whiteSpace = 'nowrap';
            label.style.fontSize = camera.labelSize + 'px';
            label.style.color = '#ffffff';
            label.style.textShadow = '0 0 4px rgba(0,0,0,0.8)';
            label.style.pointerEvents = 'none';

            element.appendChild(circle);
            element.appendChild(label);

            element.addEventListener('mousedown', (e) => this.startDrag(e, index));
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectCamera(index);
            });

            camerasLayer.appendChild(element);
        });

        document.getElementById('selectedCount').textContent = this.cameras.length + ' Camera' + (this.cameras.length !== 1 ? 's' : '');
        this.updateSettingsPanel();
    }

    startDrag(e, index) {
        e.preventDefault();
        this.isDragging = true;
        const camera = this.cameras[index];
        const rect = document.getElementById('camerasLayer').getBoundingClientRect();
        this.dragOffset.x = e.clientX - (rect.left + camera.x * this.zoom);
        this.dragOffset.y = e.clientY - (rect.top + camera.y * this.zoom);
        this.selectedCameraId = index;

        const handleMouseMove = (moveE) => {
            if (this.isDragging) {
                const rect = document.getElementById('camerasLayer').getBoundingClientRect();
                camera.x = (moveE.clientX - rect.left - this.dragOffset.x) / this.zoom;
                camera.y = (moveE.clientY - rect.top - this.dragOffset.y) / this.zoom;
                this.render();
            }
        };

        const handleMouseUp = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            this.save();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    save() {
        const data = {
            currentVenue: this.currentVenue,
            cameras: this.cameras
        };
        localStorage.setItem('venueTrackerData', JSON.stringify(data));
    }

    loadFromStorage() {
        const data = localStorage.getItem('venueTrackerData');
        if (data) {
            const parsed = JSON.parse(data);
            this.currentVenue = parsed.currentVenue || 'state-farm-arena';
            this.cameras = parsed.cameras || [];
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.venueTracker = new VenueTracker();
});