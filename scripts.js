// Counter for tracking interest
let interestCount = 243; // Starting with a fake number to show social proof

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    updateInterestCount();
    
    // Form submission listeners
    const earlyAccessForm = document.getElementById('early-access-form');
    if (earlyAccessForm) {
        earlyAccessForm.addEventListener('submit', handleEarlyAccessSubmit);
    }
});

// Update interest count display
function updateInterestCount() {
    const countElements = document.querySelectorAll('#interest-count');
    countElements.forEach(element => {
        element.textContent = `(${interestCount})`;
    });
}

// Show early access modal
function showEarlyAccessForm() {
    const modal = document.getElementById('early-access-modal');
    modal.style.display = 'flex';
    
    // Add event listener to close modal when clicking outside
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Close early access modal
function closeModal() {
    const modal = document.getElementById('early-access-modal');
    modal.style.display = 'none';
}

// Handle early access form submission
function handleEarlyAccessSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const interest = document.getElementById('interest').value;
    
    // In a real implementation, you would send this data to your backend
    console.log('Early access submission:', { name, email, interest });
    
    // Store data in localStorage for demo purposes
    const submissions = JSON.parse(localStorage.getItem('earlyAccessSubmissions') || '[]');
    submissions.push({ name, email, interest, date: new Date().toISOString() });
    localStorage.setItem('earlyAccessSubmissions', JSON.stringify(submissions));
    
    // Send to serverless function if implemented
    sendToServerless({ name, email, interest, type: 'early-access' });
    
    // Reset form and close modal
    document.getElementById('early-access-form').reset();
    closeModal();
    
    // Show thank you message
    alert('¡Gracias por tu interés! Te contactaremos pronto con más información sobre el acceso anticipado.');
}

// Register interest without early access
function registerInterest() {
    // Increment counter
    interestCount++;
    updateInterestCount();
    
    // Store in localStorage
    localStorage.setItem('interestCount', interestCount);
    
    // Show interest modal
    const modal = document.getElementById('interest-modal');
    modal.style.display = 'flex';
    
    // Add event listener to close modal when clicking outside
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeInterestModal();
        }
    });
}

// Close interest modal
function closeInterestModal() {
    const modal = document.getElementById('interest-modal');
    modal.style.display = 'none';
}

// Save interest email
function saveInterestEmail() {
    const email = document.getElementById('interest-email').value;
    
    if (!email) {
        alert('Por favor, introduce tu email para mantenerte informado.');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, introduce un email válido.');
        return;
    }
    
    // Store in localStorage
    const interestedEmails = JSON.parse(localStorage.getItem('interestedEmails') || '[]');
    if (!interestedEmails.includes(email)) {
        interestedEmails.push(email);
        localStorage.setItem('interestedEmails', JSON.stringify(interestedEmails));
    }
    
    // Send to serverless function if implemented
    sendToServerless({ email, type: 'interest' });
    
    // Close modal
    closeInterestModal();
    
    // Show thank you message
    alert('¡Gracias! Te mantendremos informado sobre el lanzamiento de CursoIA.');
}

// Function to send data to serverless function
// This would be replaced with actual fetch call in production
async function sendToServerless(data) {
    // In a real implementation, you would uncomment the following code:
    /*
    try {
        const response = await fetch('/.netlify/functions/register-interest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }
    */
    
    // For now, just log the data
    console.log('Data that would be sent to serverless function:', data);
}

// Animation on scroll
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.step, .feature, .case');
    
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        
        // If element is in viewport
        if (position.top < window.innerHeight && position.bottom >= 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Add initial animation styles
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.step, .feature, .case');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger scroll event initially to animate elements in view
    window.dispatchEvent(new Event('scroll'));
});