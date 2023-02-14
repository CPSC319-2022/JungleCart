temporary release for demo
- using mock data
- supports limited APIs: 
  - /v2/products/:id
  - /v2/products/
  - /v2/admins/:id
  - /v2/admins/:id/users
  - /v2/users/:id 
  - /v2/users/:id/buyer
  - /v2/users/:id/seller
 * detailed doc: https://www.notion.so/API-Docs-v2-20230214-working-API-list-with-mock-710d343c198345e38c851b044c3146c9

How to run?
1. create .env under be/src/  (refer .env_sample) 
2. create config.ts under be/src/config   (refer config.ts_sample) 
3. create data.ts under src/database/mock (refer : https://www.notion.so/Mock-Data-d7399e0d383740f08aeaba62af32bf89) 
