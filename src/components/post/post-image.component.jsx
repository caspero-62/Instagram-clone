import PropTypes from 'prop-types';

const PostImage = ({ src, caption }) => {
    return (
        <div className="w-full">
            <img src={src} alt={caption} />
        </div>
    );
}

PostImage.propTypes = {
    src: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
}

export default PostImage;
