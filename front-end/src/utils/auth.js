import { Cookies } from 'react-cookie'

const cookies = new Cookies();

export const Auth = {

    isAuthenticated() {
        localStorage.clear();
        return cookies.get('user')
    },

    authenticate(cb) {
        localStorage.clear();
        cookies.set('user', cb,  {
            maxAge: 60 * 60 * 1000,
            secure: true,
            sameSite: true,
            path: '/'
        });
    },

    signout(onSuccess) {
        localStorage.clear();
        console.log('AUTH: signout')
        cookies.remove('user');
        onSuccess("user disconected")
    }
}