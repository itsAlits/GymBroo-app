const url = 'https://exercisedb.p.rapidapi.com/exercises?limit=300&offset=0';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '0089c0ea9emshb7c0443e106f4e7p10a57bjsn3008ca4e0bc2',
		'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
	}
};

// Create modal HTML once
function createExerciseModal() {
    const modalHtml = `
        <div id="exercise-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/60 backdrop-blur-sm">
            <div class="bg-white backdrop-blur-md rounded-2xl w-11/12 max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden">
                <div class="bg-white/20 p-6 border-b border-gray-900/10 flex items-center justify-between">
                    <h2 id="modal-exercise-name" class="text-3xl font-bold text-gray-900 tracking-tight"></h2>
                    <button id="close-modal" class="text-gray-900 hover:text-red-600 transition-colors text-6xl cursor-pointer font-light">&times;</button>
                </div>
                <div class="grid md:grid-cols-2 gap-8 p-8">
                    <div class="flex flex-col justify-center">
                        <div class="bg-white/30 rounded-2xl p-4 shadow">
                            <img 
                                id="modal-exercise-gif" 
                                class="w-full aspect-square object-contain rounded-xl" 
                                src="" 
                                alt="Exercise Demonstration"
                            >
                        </div>
                    </div>
                    <div>
                        <div class="space-y-6">
                            <div>
                                <h3 class="text-xl font-semibold text-gray-900 mb-2 border-b border-white/20 pb-2">Exercise Details</h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-700 font-medium">Target Muscle</p>
                                        <p id="modal-exercise-target" class="text-lg font-bold text-gray-900 capitalize"></p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-700 font-medium">Equipment</p>
                                        <p id="modal-exercise-equipment" class="text-lg font-bold text-gray-900 capitalize"></p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-700 font-medium">Body Part</p>
                                        <p id="modal-exercise-bodypart" class="text-lg font-bold text-gray-900 capitalize"></p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 class="text-xl font-semibold text-gray-900 mb-2 border-b border-white/20 pb-2">Description</h3>
                                <p id="modal-exercise-description" class="text-gray-800 leading-relaxed">
                                    Detailed information about the exercise technique and benefits will be displayed here.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body if not already exists
    if (!document.getElementById('exercise-modal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // Add event listener to close modal
        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('exercise-modal').classList.add('hidden');
            document.getElementById('exercise-modal').classList.remove('flex');
        });

        // Add click outside modal to close
        document.getElementById('exercise-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                e.currentTarget.classList.add('hidden');
                e.currentTarget.classList.remove('flex');
            }
        });
    }
}

async function fetchWorkoutData() {
    try {
        const response = await fetch(url, options);
        const exercises = await response.json();
        console.log(exercises);
        
        // Create modal
        createExerciseModal();
        
        // Select the workout data container
        const workoutDataContainer = document.getElementById('card-data-workout');
        
        // Clear any existing content
        workoutDataContainer.innerHTML = '';
        
        // Create search input container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'mb-4 flex justify-center';
        searchContainer.innerHTML = `
            <input 
                type="text" 
                id="exercise-search" 
                placeholder="Search exercises..." 
                class="w-full px-4 py-3 rounded-lg border border-gray-900/10  text-gray-900 backdrop-blur-md focus:outline-none focus:ring-transparent"
            >
        `;
        workoutDataContainer.appendChild(searchContainer);
        
        // Pagination settings
        const itemsPerPage = 10;
        let currentPage = 1;
        let filteredExercises = exercises;
        
        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.className = 'overflow-x-auto';
        
        // Create table
        const table = document.createElement('table');
        table.className = 'w-full text-left border-collapse';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr class="bg-white/30 backdrop-blur-md">
                <th class="p-3 border border-white/20">GIF</th>
                <th class="p-3 border border-white/20">Exercise</th>
                <th class="p-3 border border-white/20">Target</th>
                <th class="p-3 border border-white/20">Equipment</th>
                <th class="p-3 border border-white/20">Body Part</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        tbody.id = 'exercise-table-body';
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        
        // Create pagination container
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'flex justify-center items-center space-x-2 mt-4';
        paginationContainer.id = 'pagination-controls';
        
        // Add pagination and table to workout data container
        workoutDataContainer.appendChild(tableContainer);
        workoutDataContainer.appendChild(paginationContainer);
        
        // Function to render exercises for current page
        function renderExercises() {
            // Clear existing rows
            tbody.innerHTML = '';
            
            // Calculate start and end indices for current page
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedExercises = filteredExercises.slice(startIndex, endIndex);
            
            // Populate table with exercises
            paginatedExercises.forEach((exercise, index) => {
                const row = document.createElement('tr');
                row.className = `${index % 2 === 0 ? 'bg-white/10' : 'bg-white/5'} hover:bg-white/20 transition-colors cursor-pointer`;
                row.innerHTML = `
                    <td class="p-3 border border-white/20">
                        <img src="${exercise.gifUrl}" alt="${exercise.name}" class="w-16 h-16 object-cover rounded">
                    </td>
                    <td class="p-3 border border-white/20">${exercise.name}</td>
                    <td class="p-3 border border-white/20 capitalize">${exercise.target}</td>
                    <td class="p-3 border border-white/20 capitalize">${exercise.equipment}</td>
                    <td class="p-3 border border-white/20 capitalize">${exercise.bodyPart}</td>
                `;
                
                // Add click event to show modal
                row.addEventListener('click', () => {
                    const modal = document.getElementById('exercise-modal');
                    document.getElementById('modal-exercise-name').textContent = exercise.name;
                    document.getElementById('modal-exercise-gif').src = exercise.gifUrl;
                    document.getElementById('modal-exercise-target').textContent = exercise.target;
                    document.getElementById('modal-exercise-equipment').textContent = exercise.equipment;
                    document.getElementById('modal-exercise-bodypart').textContent = exercise.bodyPart;
                    
                    // Add a placeholder description
                    document.getElementById('modal-exercise-description').textContent = 
                        `A ${exercise.bodyPart} exercise targeting the ${exercise.target} muscle group. 
                        Performed using ${exercise.equipment}. Focus on proper form and controlled movements.`;
                    
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                });
                
                tbody.appendChild(row);
            });
            
            // Update pagination controls
            renderPaginationControls();
        }
        
        // Function to render pagination controls
        function renderPaginationControls() {
            const paginationControls = document.getElementById('pagination-controls');
            paginationControls.innerHTML = '';
            
            const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);
            
            // Previous button
            const prevButton = document.createElement('button');
            prevButton.textContent = '←';
            prevButton.className = `px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white/30 hover:bg-white/50'}`;
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderExercises();
                }
            });
            
            // Page number display
            const pageInfo = document.createElement('span');
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            pageInfo.className = 'px-4 py-2';
            
            // Next button
            const nextButton = document.createElement('button');
            nextButton.textContent = '→';
            nextButton.className = `px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white/30 hover:bg-white/50'}`;
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderExercises();
                }
            });
            
            paginationControls.appendChild(prevButton);
            paginationControls.appendChild(pageInfo);
            paginationControls.appendChild(nextButton);
        }
        
        // Add search functionality
        const searchInput = document.getElementById('exercise-search');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            // Filter exercises based on search term
            filteredExercises = exercises.filter(exercise => {
                // Search across multiple fields
                const searchFields = [
                    exercise.name.toLowerCase(),
                    exercise.target.toLowerCase(),
                    exercise.equipment.toLowerCase(),
                    exercise.bodyPart.toLowerCase()
                ];
                
                // Check if any field includes the search term
                return searchFields.some(field => field.includes(searchTerm));
            });
            
            // Reset to first page after search
            currentPage = 1;
            
            // Render filtered exercises
            renderExercises();
            
            // If no results, show a "No results" message
            if (filteredExercises.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center p-4 text-gray-500">
                            No exercises found matching "${this.value}"
                        </td>
                    </tr>
                `;
                
                // Clear pagination controls
                document.getElementById('pagination-controls').innerHTML = '';
            }
        });
        
        // Initial render
        renderExercises();
        
    } catch (error) {
        console.error('Error fetching workout data:', error);
        workoutDataContainer.innerHTML = `
            <div class="text-red-500 p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/20">
                Failed to load workout data. Please try again later.
                <p class="text-sm mt-2">${error.message}</p>
            </div>
        `;
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchWorkoutData);