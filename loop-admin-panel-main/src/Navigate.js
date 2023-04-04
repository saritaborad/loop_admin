import { useNavigate, useParams } from 'react-router-dom';
export const withRouter = (Component) => {
    const Wrapper = (props) => {
        const navigate = useNavigate();
        const searchParams = useParams()
        return (
            <Component
                navigate={navigate}
                Location={searchParams}
                {...props}
            />
        );
    };
    return Wrapper;
};