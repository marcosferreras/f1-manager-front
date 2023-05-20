import { Pulsar } from '@uiball/loaders';
import './styles.css';

const Loading = () => {
    return (
        <div className="loading">
            <div className='loader'>
                <Pulsar
                    size={50}
                    speed={2}
                    color="#b20600"
                />
                <h1 className="loader-text">Loading...</h1>
            </div>
        </div>
    );
}

export default Loading;
