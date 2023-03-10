

---

<br/>

1. Clone this repository
1. Create `.env` file in root directory and paste the code from the pdf file.

1. Open your **terminal** and navigate the root directory

    ```
    $ npm install
    $ npm run dev
    ```

    The server is now listening at `http://localhost:8080` and watching for changes.

1. To view the route list open a new terminal and run `npm run route-list`, that should display the ff.
      ```
      ┌─────┬───────────────┬────────────────────────────────────────┐
      │ #   │ METHOD        │ URI                                    │
      ├─────┼───────────────┼────────────────────────────────────────┤
      │ 1   │ GET,POST      │ /api/v1/conversation                   │
      ├─────┼───────────────┼────────────────────────────────────────┤
      │ 2   │ DELETE        │ /api/v1/conversation/:id               │
      └─────┴───────────────┴────────────────────────────────────────┘
      ```

1. Open to your **Postman** and hit the endpoints


- Create a conversation **POST**
   - body:
      ```
      { conversation_id: 'xyz001', message: "Hi, I'm Michael" }
      ```
   - endpoint:
      ```
      /api/v1/conversation
      ```
- Remove a conversation **DELETE**
   - endpoint:
    ```
     /api/v1/conversation/xyz001
    ```

- Fetch all the conversation method **GET**
   - endpoint:
    ```
     /api/v1/conversation
    ```

- Fetch single convertation method **GET**
   - endpoint:
    ```
     /api/v1/conversation?conversation_id=abc003
    ```



<br/>

---

### Instruction for viewing the database in the cloud using MongoDB Compass (GUI)



<br/>

1. Open MongoDB Compass or any GUI
1. Create a connection and paste the link access below
   ```
   mongodb+srv://adacaUserReadOnly:rJYfUN5rv5RBtaDN@michael-antoni.0vpcv.mongodb.net/adaca-db?retryWrites=true&w=majority
   ```
1. Note access is read only for viewing purposes

<br/>
<br/>
<br/>



-   Created by: [Michael B. Antoni](https://michaelantoni.netlify.app/)
-   Email: michaelantoni.cs@gmail.com
