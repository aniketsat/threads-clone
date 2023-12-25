const generateUsername = (email: string) => {
    let username = email.split('@')[0];
    username = username.replace(/[^a-zA-Z0-9]/g, '');
    username = username.toLowerCase();
    username = username + Math.floor(Math.random() * 1000);
    return username;
}


export {generateUsername};