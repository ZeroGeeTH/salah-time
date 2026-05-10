// tagSelectionRules.js
// Implements broad + subtopic tag selection rules

/**
 * Given a set of selected tags and knowledge of which tags are broad, 
 * applies selection rules for broad+subtopic tag pairs.
 *
 * Rules:
 * 1. If a broad tag is selected, prevent selecting any of its subtopics.
 * 2. If a subtopic is selected, prevent selecting its parent broad tag.
 * 3. Subtopics are given as a mapping broadTag -> [subtag1, subtag2, ...]
 *
 * Example usage:
 *   const rules = makeTagSelectionRules({
 *      'python': ['python-django', 'python-flask'],
 *      'javascript': ['reactjs', 'vuejs']
 *   });
 *   rules.isTagSelectable('python', ['python-django']) // false
 */

function makeTagSelectionRules(broadToSubtopics) {
  // Invert broadToSubtopics to subToBroad mapping
  const subToBroad = {};
  for (const broad in broadToSubtopics) {
    for (const sub of broadToSubtopics[broad]) {
      subToBroad[sub] = broad;
    }
  }

  /**
   * Checks if a tag is selectable given currentSelectedTags
   * @param {string} tag - tag to select
   * @param {Array<string>} currentSelected - currently selected tags
   * @returns {boolean}
   */
  function isTagSelectable(tag, currentSelected) {
    // If tag is a broad tag
    if (broadToSubtopics[tag]) {
      // If any of its subtopics are already selected, can't select broad
      for (const sub of broadToSubtopics[tag]) {
        if (currentSelected.includes(sub)) return false;
      }
      return true;
    }

    // If tag is a subtopic
    if (subToBroad[tag]) {
      const parent = subToBroad[tag];
      // If parent broad tag is already selected, can't select subtopic
      if (currentSelected.includes(parent)) return false;
      return true;
    }

    // Neither broad nor sub: always selectable
    return true;
  }

  /**
   * Given a candidate tag list and current selected, returns tags that are selectable
   */
  function getSelectableTags(candidateTags, currentSelected) {
    return candidateTags.filter(t => isTagSelectable(t, currentSelected));
  }

  return {
    isTagSelectable,
    getSelectableTags,
  }
}

module.exports = {
  makeTagSelectionRules,
};
