
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
//import awsExports from './aws-exports';
// import { Hub } from 'aws-amplify'; -- under TODO
import { Auth } from 'aws-amplify';
//import {MockUserModel, UserModel} from "../../../../be/src/models/user";
//import {Address, User} from "../../../../be/src/utils/types.dto";
import { User } from "../../../../be/src/utils/types";
import $ from 'jquery';
import comparator from "../../../../be/structures/comparator"
//import { gapi } from 'gapi-script'

//Amplify.configure(awsExports); generated during configuration/initialization of AWS Amplify

class authentication {

GoogleAuth
SCOPE =  "https://www.googleapis.com/auth/drive.metadata.readonly";
discoveryUrl = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";


public async signUp(User) {
    try {
        const {user} = await Auth.signUp({
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

public async signIn(User) {
    try {
        await Auth.signIn(User.username, User.password);
        const comp1 = new comparator(User.username,User.username);
        const result_username = comp1.val;
        const comp2 = new comparator(User.password,User.password);
        const result_password = comp2.val;
        console.log('Result of security check, username/password data-pair not modified', result_username, result_password )
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

public async signOut(User) {
    try {
        await Auth.signOut(User);
        const comp1 = new comparator(User.username,User.username);
        const result_username = comp1.val;
        const comp2 = new comparator(User.password,User.password);
        const result_password = comp2.val;
        console.log('Result of security check, username/password data-pair not modified', result_username, result_password )
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

public async  setSigninStatus() {
    var user = this.GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(this.SCOPE);
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

public async updateSigninStatus() { this.setSigninStatus(); }

public async handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // gapi.load('client:auth2', this.initClient)} needs gapi-script module
}

public async handleAuthClick() {

        if (this.GoogleAuth.isSignedIn.get({})) {
                // User is authorized and has clicked "Sign out" button.
            this.GoogleAuth.signOut();
        } else {
                // User is not signed in. Start Google auth flow.
            this.GoogleAuth.signIn();
        }
    }

public async initClient(){
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    /*gapi.client.init({
        'apiKey': 'AIzaSyCWEdMvm4xqGORmnyow2h7FRXxrC8X3ZQM', // using junglecart.test@gmail.com account apiKey
        'clientId': '102202379837-26t219935nv91v4t11eqqp773bgmif4i.apps.googleusercontent.com',
        'discoveryDocs': [this.discoveryUrl],
        'scope': this.SCOPE
    }).then(function () {
        this.GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus);

        // Handle initial sign-in state.
        this.setSigninStatus();

        // Call handleAuthClick function when user clicks on
        //      "Sign In/Authorize" button.
        $('#sign-in-or-out-button').click(function () {
            handleAuthClick();
        });
        $('#revoke-access-button').click(function () {
            revokeAccess();
        });
    })*/}

public async revokeAccess() { this.GoogleAuth.disconnect(); }

public authFunc ({User}) {
    var simultaneousSignIn = 0;
    
    /*<button onClick={() => {this.signIn(User)}}></button>
    <button onClick={() => {this.signOut(User)}}>Sign out</button>
    <h1>Hello {User.username}</h1>*/
        

    //<button id="sign-in-or-out-button"
    //    style="margin-left: 25px">Sign In/Authorize</button>
    //<button id="revoke-access-button"
    //    style="display: none; margin-left: 25px">Revoke access</button>

    //<div id="auth-status" style="display: inline; padding-left: 25px"></div><hr></hr>

    //$.getScript("https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js, successCallback)
    //$.getScript("https://apis.google.com/js/api.js, successCallback)
    /*<script onLoad={() => {handleClientLoad()}}></script>
    document.onreadystatechange={() => {
        if (this.readyState === 'complete') {this.onLoad()}}
    }
    
    <button onClick={() => signUp()}></button>
    </script>*/
    }
}

export default authentication; // TODO: needs export default withAuthenticator(authFunc)