
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
// import { Hub } from 'aws-amplify'; -- under TODO
import { Auth } from 'aws-amplify';
//import {MockUserModel, UserModel} from "../../../../be/src/models/user";
//import {Address, User} from "../../../../be/src/utils/types.dto";
//import User from "../../../../be/src/utils/types";
import { gapi } from "gapi-script";
import $ from 'jquery';
import comparator from "../../../../backend/structures/comparator"

Amplify.configure(awsExports);

var GoogleAuth;
const SCOPE = "https://www.googleapis.com/auth/drive.metadata.readonly";
const discoveryUrl = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
let script = document.createElement("script")
script.type = "text/javascript";

async function signUp() {
    try {
        const {user} = await Auth.signUp({
            id: User.id, // id parameter for use in SQL database lookup
            first_name: User.first_name, // database usage
            last_name: User.last_name, // database usage
            email: User.email, // database usage
            department: User.department, // database usage
            created_at: User.created_at, // database usage
            address: User.Address, // database usage
            username: User.username,
            password: User.password,
            attributes: {
                phone_number: {} ,       // optional - E.164 number convention: see
                                         // https://en.wikipedia.org/wiki/E.164
                                        // other custom attributes
            },
            autoSignIn: { // optional - enables auto sign in after user is confirmed
                enabled: true,
            }
        });
        console.log(user);
    } catch (error) {
        console.log('error signing up:', error);
    }
}

/* TODO: Enable autosign-in
function listenToAutoSignInEvent() {
    Hub.listen('auth', ({ payload }) => {
        const { event } = payload;
        if (event === 'autoSignIn') {
            const user = payload.data;
            // assign user
        } else if (event === 'autoSignIn_failure') {
            // redirect to sign in page
        }
    })
}
*/

// TODO
/*async function resendConfirmationCode() {
    try {
        await Auth.resendSignUp(username);
        console.log('code resent successfully');
    } catch (err) {
        console.log('error resending code: ', err);
    }
}*/

async function signIn(User) {
    try {
        await Auth.signIn(User.username, User.password);
        const comp = new comparator();
        const result_username = comp(User.username,User.username);
        const result_password = comp(User.password,User.password);
        console.log('Result of security check, two-fold data not modified', result_username, result_password )
    } catch (error) {
        console.log('error signing in', error);
    }
}

async function signOut(User) {
    try {
        await Auth.signOut(User);
        const comp = new comparator();
        const result_username = comp(User.username,User.username);
        const result_password = comp(User.password,User.password);
        console.log('Result of security check, two-fold data not modified', result_username, result_password )
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

async function setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        $('#sign-in-or-out-button').html('Sign out');
        $('#revoke-access-button').css('display', 'inline-block');
        $('#auth-status').html('You are currently signed in and have granted ' +
            'access to this app.');
    }
    else {
        {$('#sign-in-or-out-button').html('Sign In/Authorize');}
        $('#revoke-access-button').css('display', 'none');
        $('#auth-status').html('You have not authorized this app or you are ' +
            'signed out.');
    }
} 

async function updateSigninStatus() { setSigninStatus(); }

async function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient)}

async function handleAuthClick() {

        if (GoogleAuth.isSignedIn.get({})) {
                // User is authorized and has clicked "Sign out" button.
            GoogleAuth.signOut();
        } else {
                // User is not signed in. Start Google auth flow.
            GoogleAuth.signIn();
        }
    }

async function initClient(){
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyCWEdMvm4xqGORmnyow2h7FRXxrC8X3ZQM',
        'clientId': '102202379837-26t219935nv91v4t11eqqp773bgmif4i.apps.googleusercontent.com',
        'discoveryDocs': [discoveryUrl],
        'scope': SCOPE
    }).then(function () {
        GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);

        // Handle initial sign-in state.
        setSigninStatus();

        // Call handleAuthClick function when user clicks on
        //      "Sign In/Authorize" button.
        $('#sign-in-or-out-button').click(function () {
            handleAuthClick();
        });
        $('#revoke-access-button').click(function () {
            revokeAccess();
        });
    })}

async function revokeAccess() { GoogleAuth.disconnect(); }

function authFunc ({User}) {
    var simultaneousSignIn = 0;
    <>
    <button onClick={signIn(User)}></button>
    <button onClick={() => signOut(User)}>Sign out</button>
    <h1>Hello {User.username}</h1>
    
    <script>        

    <button id="sign-in-or-out-button"
        style="margin-left: 25px">Sign In/Authorize</button>
    <button id="revoke-access-button"
        style="display: none; margin-left: 25px">Revoke access</button>

    <div id="auth-status" style="display: inline; padding-left: 25px"></div><hr></hr>

    $.getScript(https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js, successCallback)
    $.getScript(https://apis.google.com/js/api.js, successCallback)
    <script onLoad={() => {handleClientLoad()}}></script>
    document.onreadystatechange={() => {
        if (this.readyState === 'complete') {this.onLoad()}}
    }
    
    <button onClick={() => signUp()}></button>
    </script>
    </>}

export default withAuthenticator(authFunc);
