import React from 'react';
import PropTypes from 'prop-types';
import { localizeTag } from '../utils/tagLocalizer';

function TagLabel({ tag, lang }) {
  return (
    <span className="tag-label">{localizeTag(tag, lang)}</span>
  );
}

TagLabel.propTypes = {
  tag: PropTypes.string.isRequired,
  lang: PropTypes.string
};

TagLabel.defaultProps = {
  lang: 'en'
};

export default TagLabel;
