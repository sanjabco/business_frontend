import { getCookie } from '../../helper';

export const useAuth = () => {
    const user = getCookie("jwt");
    return user ? true : false;
};