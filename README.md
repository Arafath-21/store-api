# Store API
This project is a simple store API built with Node.js, Express, and MongoDB. It allows you to manage and query a collection of products with various filtering, sorting, and pagination options.
## Features
- Retrieve all products with optional filtering by `featured`, `company`, and `name`
- Sort products by specified fields
- Select specific fields to return
- Pagination support
- Handle numeric filters for `price` and `rating`
## Setup
### Prerequisites
- Node.js (v14 or later)
- MongoDB
### Installation
1. Clone the repository:
    bash
    git clone https://github.com/yourusername/store-api.git
    cd store-api    
2. Install the dependencies:
    bash
    npm install
3. Set up environment variables:
    Create a `.env` file in the root directory and add your MongoDB connection string:    
    MONGO_URI=<your_mongodb_connection_string>
    PORT=3000   
4. Start the server:
    bash
    npm start
5. Populate the database with sample data (optional):
    bash
    node populate
## Usage
### Endpoints
#### Get All Products
- **URL:** `/api/v1/products`
- **Method:** `GET`
- **Query Parameters:**
  - `featured` (boolean): Filter products by featured status
  - `company` (string): Filter products by company name
  - `name` (string): Search products by name (case-insensitive)
  - `sort` (string): Sort products by specified fields (comma-separated)
  - `fields` (string): Select specific fields to return (comma-separated)
  - `page` (number): Page number for pagination
  - `limit` (number): Number of products per page
  - `numericFilters` (string): Apply numeric filters for `price` and `rating` (e.g., `price>30,rating>=4`)
- **Example Request:**
    GET /api/v1/products?featured=true&company=ikea&name=table&sort=price,-rating&fields=name,price,rating&page=2&limit=5&numericFilters=price>30,rating>=4
- **Example Response:**
    json
    {
        "nbhits": 2,
        "message": "products route",
        "products": [
            {
                "name": "IKEA Table",
                "price": 50,
                "rating": 4.5
            },
            {
                "name": "IKEA Chair",
                "price": 40,
                "rating": 4.7
            }
        ]
    }
### How It Works
#### Filtering
- **Featured:** 
  javascript
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  
  Filters products by the `featured` status if the `featured` query parameter is provided.
- **Company:** 
  javascript
  if (company) {
    queryObject.company = company;
  }
  Filters products by the `company` name if the `company` query parameter is provided.
- **Name:** 
  javascript
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }
  Performs a case-insensitive search for products by `name` if the `name` query parameter is provided.
#### Numeric Filters
- **Numeric Filters:** 
  javascript
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  Converts numeric filter query parameters into MongoDB query operators and adds them to the `queryObject`.
#### Sorting
- **Sorting:** 
  javascript
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }
  Sorts the products by the specified fields. If no sort parameter is provided, it defaults to sorting by `createdAt`.
#### Selecting Fields
- **Field Selection:** 
  javascript
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }
  Selects only the specified fields to be returned in the response.
#### Pagination
- **Pagination:** 
  javascript
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  Implements pagination by calculating the number of documents to skip and limit per page.
#### Sending the Response:
  javascript
  res.status(200).send({
    nbhits: products.length,
    message: "products route",
    products,
  }); 
  Sends a JSON response containing the number of hits (`nbhits`), a message, and the array of products.
