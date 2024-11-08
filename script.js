// Utility functions
const showLoading = (form) => {
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
    return () => {
        button.disabled = false;
        button.innerHTML = originalText;
    };
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Form display toggle
function showForm(type) {
    const singlePrediction = document.getElementById('singlePrediction');
    const batchPrediction = document.getElementById('batchPrediction');
    const buttons = document.querySelectorAll('.nav-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (type === 'single') {
        singlePrediction.style.display = 'block';
        batchPrediction.style.display = 'none';
        setTimeout(() => {
            singlePrediction.classList.add('fade-in');
            batchPrediction.classList.remove('fade-in');
        }, 50);
    } else {
        batchPrediction.style.display = 'block';
        singlePrediction.style.display = 'none';
        setTimeout(() => {
            batchPrediction.classList.add('fade-in');
            singlePrediction.classList.remove('fade-in');
        }, 50);
    }
}

// File upload handling
const uploadContainer = document.querySelector('.upload-container');
const fileInput = document.getElementById('csvFile');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadContainer.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
});

['dragenter', 'dragover'].forEach(eventName => {
    uploadContainer.addEventListener(eventName, () => {
        uploadContainer.classList.add('drag-active');
    });
});

['dragleave', 'drop'].forEach(eventName => {
    uploadContainer.addEventListener(eventName, () => {
        uploadContainer.classList.remove('drag-active');
    });
});

uploadContainer.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    fileInput.files = files;
    updateFileName(files[0]);
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        updateFileName(e.target.files[0]);
    }
});

function updateFileName(file) {
    const fileNameDisplay = uploadContainer.querySelector('p');
    fileNameDisplay.textContent = `Selected file: ${file.name}`;
}

// Single prediction form handling
document.getElementById('singleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const stopLoading = showLoading(this);
    
    const formData = {
        customId: document.getElementById('customId').value,
        revenue: parseFloat(document.getElementById('revenue').value),
        timestamp: document.getElementById('timestamp').value
    };

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock response - Replace with actual API call
        const response = await mockPredictionAPI(formData);
        displaySingleResults(response);
        animateResults();
    } catch (error) {
        showError('An error occurred while processing your request.');
        console.error('Error:', error);
    } finally {
        stopLoading();
    }
});

// Batch prediction form handling
document.getElementById('batchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const stopLoading = showLoading(this);
    
    const file = document.getElementById('csvFile').files[0];
    if (!file) {
        showError('Please select a file first.');
        stopLoading();
        return;
    }

    try {
        await processBatchFile(file);
        const batchResult = document.getElementById('batchResult');
        batchResult.style.display = 'block';
        batchResult.classList.add('fade-in');
        setupDownloadLink();
    } catch (error) {
        showError('An error occurred while processing your file.');
        console.error('Error:', error);
    } finally {
        stopLoading();
    }
});

async function mockPredictionAPI(data) {
    // Simulate API response
    return {
        predicted_cltv: Math.random() * 10000,
        purchase_probability: Math.random(),
        customer_segment: ["High Value", "Medium Value", "Low Value"][Math.floor(Math.random() * 3)],
        marketing_strategy: ["Premium Retention", "Standard Engagement", "Reactivation Campaign"][Math.floor(Math.random() * 3)]
    };
}

async function processBatchFile(file) {
    // Simulate file processing
    return new Promise(resolve => setTimeout(resolve, 2000));
}

function displaySingleResults(results) {
    const resultElement = document.getElementById('singleResult');
    
    document.getElementById('predictedCltv').textContent = formatCurrency(results.predicted_cltv);
    document.getElementById('purchaseProb').textContent = `${(results.purchase_probability * 100).toFixed(1)}%`;
    document.getElementById('customerSegment').textContent = results.customer_segment;
    document.getElementById('marketingStrategy').textContent = results.marketing_strategy;

    resultElement.style.display = 'block';
    resultElement.classList.add('fade-in');
}

function animateResults() {
    const cards = document.querySelectorAll('.result-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('card-appear');
        }, index * 100);
    });
}

function setupDownloadLink() {
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.addEventListener('click', function(e) {
        e.preventDefault();
        generateAndDownloadCSV();
    });
}

function generateAndDownloadCSV() {
    const mockData = 'Customer ID,Predicted CLTV,Purchase Probability,Segment,Strategy\n' +
                    'MOCK001,1234.56,0.78,High Value,Premium Retention';
    
    const blob = new Blob([mockData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'predictions.csv');
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-toast';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
    
    setTimeout(() => {
        errorElement.classList.add('fade-out');
        setTimeout(() => {
            errorElement.remove();
        }, 300);
    }, 3000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    showForm('single'); // Show single prediction form by default
});
