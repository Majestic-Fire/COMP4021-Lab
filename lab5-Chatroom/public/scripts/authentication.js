const Authentication = (function () {
    // This stores the current signed-in user
    let user = null;

    // This function gets the signed-in user
    const getUser = function () {
        return user;
    }

    // This function sends a sign-in request to the server
    // * `username`  - The username for the sign-in
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const signin = function (username, password, onSuccess, onError) {

        //
        // A. Preparing the user data
        //
        const data = JSON.stringify({ username, password });

        //
        // B. Sending the AJAX request to the server
        //
        fetch("/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.status === "error") {
                    //
                    // F. Processing any error returned by the server
                    //
                    if (onError) onError(json.error);
                    return;
                }
                else if (json.status === "success") {
                    //
                    // H. Handling the success response from the server
                    //
                    user = json.user;
                    if (onSuccess) onSuccess();
                }


            })
            .catch((err) => {
                if (onError) onError("Failed to fetch: " + err.message);
            });
    };

    // This function sends a validate request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const validate = function (onSuccess, onError) {

        //
        // A. Sending the AJAX request to the server
        //
        fetch("/validate", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.status === "error") {
                    //
                    // C. Processing any error returned by the server
                    //
                    if (onError) onError(json.error);
                    return;
                }
                else if (json.status === "success") {
                    //
                    // E. Handling the success response from the server
                    //
                    user = json.user;
                    if (onSuccess) onSuccess();
                }

            })
            .catch((err) => {
                if (onError) onError("Failed to fetch: " + err.message);
            });
    };

    // This function sends a sign-out request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const signout = function (onSuccess, onError) {
        fetch("/signout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.status === "error") {
                    // Processing any error returned by the server
                    if (onError) onError(json.error);
                    return;
                }
                else if (json.status === "success") {
                    // Handling the success response from the server
                    user = null;
                    if (onSuccess) onSuccess();
                }

            })
            .catch((err) => {
                if (onError) onError("Failed to fetch: " + err.message);
            });

    };

    return { getUser, signin, validate, signout };
})();
