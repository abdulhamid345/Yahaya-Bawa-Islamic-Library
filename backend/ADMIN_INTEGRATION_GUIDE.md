# Admin Dashboard Integration Guide

This guide explains how to integrate your existing Vue.js admin dashboard (`admin-dashboard.html`) with the Node.js backend.

## Overview

The admin dashboard is designed to work with the backend API to manage scholars, books, categories, and users. This guide will help you modify your frontend code to connect with the backend endpoints.

## Prerequisites

- Backend API is set up and running
- Admin user is created in the database
- You have the admin dashboard HTML file

## Authentication Integration

### 1. Update Login Functionality

In your admin login page, update the login method to use the backend API:

```javascript
methods: {
  async login() {
    try {
      const response = await fetch('http://your-api-url/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role
        }));

        // Redirect to admin dashboard
        window.location.href = '/admin-dashboard.html';
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  }
}
```

### 2. Add Authentication Check to Dashboard

Add this to your admin dashboard page to ensure only authenticated admins can access it:

```javascript
// Add this to the created() hook or beforeMount() hook
created() {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token || user.role !== 'admin') {
    // Redirect to login page
    window.location.href = '/login.html';
    return;
  }
  
  // Set up axios default headers for all future requests
  this.setupAxiosAuth(token);
  
  // Load initial data
  this.loadScholars();
},

methods: {
  setupAxiosAuth(token) {
    // If you're using axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  }
}
```

## Scholars Management Integration

### 1. Load Scholars from API

Replace the static scholar data with API calls:

```javascript
methods: {
  async loadScholars() {
    try {
      const response = await fetch('http://your-api-url/api/admin/scholars', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.scholars = data.data.map(scholar => ({
          id: scholar._id,
          name: scholar.name,
          description: scholar.description,
          initial: scholar.initial || scholar.name[0],
          bookCount: scholar.bookCount || 0
        }));
      } else {
        alert('Failed to load scholars: ' + data.message);
      }
    } catch (error) {
      console.error('Error loading scholars:', error);
      alert('An error occurred while loading scholars');
    }
  }
}
```

### 2. Add New Scholar Function

```javascript
async saveScholar() {
  try {
    const url = this.editingScholar 
      ? `http://your-api-url/api/scholars/${this.editingScholar.id}`
      : 'http://your-api-url/api/scholars';
      
    const method = this.editingScholar ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(this.scholarForm)
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert(this.editingScholar ? 'Scholar updated successfully' : 'Scholar added successfully');
      
      // Reload scholars list
      this.loadScholars();
      
      // Reset form
      this.showScholarForm = false;
      this.editingScholar = null;
      this.scholarForm = { name: '', description: '' };
    } else {
      alert(data.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Error saving scholar:', error);
    alert('An error occurred while saving the scholar');
  }
}
```

### 3. Delete Scholar Function

```javascript
async deleteScholar(id) {
  if (confirm('Are you sure you want to delete this scholar?')) {
    try {
      const response = await fetch(`http://your-api-url/api/scholars/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Scholar deleted successfully');
        // Remove from local array
        this.scholars = this.scholars.filter(s => s.id !== id);
      } else {
        alert(data.message || 'Failed to delete scholar');
      }
    } catch (error) {
      console.error('Error deleting scholar:', error);
      alert('An error occurred while deleting the scholar');
    }
  }
}
```

## Books Management Integration

### 1. Load Books for a Scholar

```javascript
async scholarBooks(scholarId) {
  try {
    const response = await fetch(`http://your-api-url/api/admin/scholars/${scholarId}/books`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.map(book => ({
        id: book._id,
        scholarId,
        title: book.title,
        category: book.category ? book.category.name : 'Uncategorized'
      }));
    } else {
      console.error('Failed to load books:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error loading books:', error);
    return [];
  }
}
```

### 2. Add New Book Function

```javascript
async saveBook() {
  try {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('title', this.bookForm.title);
    formData.append('category', this.bookForm.category);
    formData.append('scholar', this.selectedScholar.id);
    
    if (this.bookForm.file) {
      formData.append('bookFile', this.bookForm.file);
    }
    
    const response = await fetch('http://your-api-url/api/books', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Book added successfully');
      
      // Clear form and close modal
      this.showBookForm = false;
      this.bookForm = { title: '', file: null, category: '' };
      
      // Reload books for this scholar
      this.loadScholarsWithBooks();
    } else {
      alert(data.message || 'Failed to add book');
    }
  } catch (error) {
    console.error('Error adding book:', error);
    alert('An error occurred while adding the book');
  }
}
```

### 3. Delete Book Function

```javascript
async deleteBook(id) {
  if (confirm('Are you sure you want to delete this book?')) {
    try {
      const response = await fetch(`http://your-api-url/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Book deleted successfully');
        // Reload all data
        this.loadScholarsWithBooks();
      } else {
        alert(data.message || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('An error occurred while deleting the book');
    }
  }
}
```

## Loading Categories

```javascript
async loadCategories() {
  try {
    const response = await fetch('http://your-api-url/api/categories', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      this.categories = data.data.map(category => category.name);
    } else {
      console.error('Failed to load categories:', data.message);
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}
```

## Dashboard Statistics

Add this to your admin dashboard to show statistics:

```javascript
data() {
  return {
    // ... other data properties
    stats: {
      users: 0,
      books: 0,
      scholars: 0,
      categories: 0
    },
    recentUsers: [],
    topBooks: []
  }
},

methods: {
  async loadDashboardStats() {
    try {
      const response = await fetch('http://your-api-url/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.stats = data.data.counts;
        this.recentUsers = data.data.recentUsers;
        this.topBooks = data.data.topBooks;
      } else {
        console.error('Failed to load dashboard stats:', data.message);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }
}
```

## Featured Content Management

Add functionality to set featured items:

```javascript
async setFeatured(type, id, featured) {
  try {
    const response = await fetch(`http://your-api-url/api/admin/featured/${type}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ featured })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert(`${type} featured status updated successfully`);
      
      // Reload data based on type
      if (type === 'scholar') {
        this.loadScholars();
      } else if (type === 'book') {
        this.loadScholarsWithBooks();
      } else if (type === 'category') {
        this.loadCategories();
      }
    } else {
      alert(data.message || 'Failed to update featured status');
    }
  } catch (error) {
    console.error(`Error setting ${type} as featured:`, error);
    alert(`An error occurred while updating the ${type} featured status`);
  }
}
```

## Complete Admin Dashboard Component

Here's how to put it all together in your Vue app:

```javascript
const { createApp } = Vue;

createApp({
  data() {
    return {
      scholars: [],
      books: [],
      categories: [],
      stats: {
        users: 0,
        books: 0,
        scholars: 0,
        categories: 0
      },
      showScholarForm: false,
      showBookForm: false,
      editingScholar: null,
      selectedScholar: null,
      scholarForm: {
        name: '',
        description: ''
      },
      bookForm: {
        title: '',
        file: null,
        category: ''
      }
    };
  },
  
  created() {
    // Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
      window.location.href = '/login.html';
      return;
    }
    
    // Load initial data
    this.loadDashboardStats();
    this.loadScholars();
    this.loadCategories();
  },
  
  methods: {
    // Authentication methods
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login.html';
    },
    
    // Data loading methods
    async loadDashboardStats() {
      // Implementation as above
    },
    
    async loadScholars() {
      // Implementation as above
    },
    
    async loadCategories() {
      // Implementation as above
    },
    
    // Scholar management methods
    editScholar(scholar) {
      this.editingScholar = scholar;
      this.scholarForm = { 
        name: scholar.name, 
        description: scholar.description 
      };
      this.showScholarForm = true;
    },
    
    async saveScholar() {
      // Implementation as above
    },
    
    async deleteScholar(id) {
      // Implementation as above
    },
    
    // Book management methods
    showBookUpload(scholar) {
      this.selectedScholar = scholar;
      this.showBookForm = true;
    },
    
    handleFileUpload(event) {
      this.bookForm.file = event.target.files[0];
    },
    
    async saveBook() {
      // Implementation as above
    },
    
    async deleteBook(id) {
      // Implementation as above
    },
    
    // Featured content management
    async setFeatured(type, id, featured) {
      // Implementation as above
    }
  }
}).mount('#app');
```

## Admin Dashboard HTML Structure Modifications

Update your HTML structure to show statistics:

```html
<div class="max-w-7xl mx-auto px-4 py-8">
  <!-- Dashboard Statistics -->
  <div class="grid grid-cols-4 gap-4 mb-8">
    <div class="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 class="text-xl font-bold text-gray-700">Users</h3>
      <p class="text-3xl font-bold text-green-600">{{ stats.users }}</p>
    </div>
    <div class="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 class="text-xl font-bold text-gray-700">Books</h3>
      <p class="text-3xl font-bold text-green-600">{{ stats.books }}</p>
    </div>
    <div class="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 class="text-xl font-bold text-gray-700">Scholars</h3>
      <p class="text-3xl font-bold text-green-600">{{ stats.scholars }}</p>
    </div>
    <div class="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 class="text-xl font-bold text-gray-700">Categories</h3>
      <p class="text-3xl font-bold text-green-600">{{ stats.categories }}</p>
    </div>
  </div>

  <!-- Scholars Management -->
  <div class="mb-12">
    <!-- Existing scholars management code -->
  </div>
</div>
```

## Tips for Testing the Integration

1. **Test Authentication First**:
   - Make sure login works and stores the token
   - Verify the token is used in subsequent requests
   - Test that unauthorized users can't access the admin dashboard

2. **Test Data Loading**:
   - Verify scholars load correctly
   - Check that categories are loaded
   - Confirm dashboard statistics display properly

3. **Test CRUD Operations**:
   - Add a new scholar and verify it appears in the list
   - Edit a scholar and check that changes persist
   - Delete a scholar and verify it's removed
   - Add a book to a scholar and check it's displayed
   - Delete a book and verify it's removed

4. **Test Featured Content**:
   - Set a scholar as featured and verify it works
   - Set a book as featured and check the frontend reflects this

## Troubleshooting Common Issues

### Authentication Problems

- **Issue**: Unable to log in
  - **Solution**: Check that the API URL is correct and the backend is running
  - **Solution**: Verify your admin user credentials in the database

- **Issue**: "Unauthorized" errors after login
  - **Solution**: Check that the token is being stored correctly
  - **Solution**: Verify the token is being sent in the Authorization header

### CORS Issues

- **Issue**: Cross-Origin Request Blocked errors
  - **Solution**: Ensure your backend has CORS enabled with the correct origin
  - **Solution**: Check that your API requests use the full URL including protocol (http/https)

### Data Loading Issues

- **Issue**: Scholars don't load
  - **Solution**: Check the network request in browser developer tools
  - **Solution**: Verify the API endpoint path is correct
  - **Solution**: Make sure you're handling the API response structure correctly

### File Upload Problems

- **Issue**: Book file upload fails
  - **Solution**: Ensure you're using FormData correctly
  - **Solution**: Check file size limits in your backend
  - **Solution**: Verify your content type is not being explicitly set for FormData requests

## Next Steps

After integrating the admin dashboard, consider these enhancements:

1. Add a user management section
2. Implement a dashboard for borrowing history
3. Add search functionality to the admin interface
4. Create reports and analytics visualizations
5. Implement batch operations for efficiency

Remember to always test your integration thoroughly before deploying to production.