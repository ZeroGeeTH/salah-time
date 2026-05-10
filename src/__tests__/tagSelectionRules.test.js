const { makeTagSelectionRules } = require('../tagSelectionRules');

describe('broad+subtopic tag selection rules', () => {
  const ruleSet = makeTagSelectionRules({
    'python': ['python-django', 'python-flask'],
    'javascript': ['reactjs', 'vuejs']
  });

  test('cannot select broad tag when any subtopic is selected', () => {
    expect(ruleSet.isTagSelectable('python', ['python-django'])).toBe(false);
    expect(ruleSet.isTagSelectable('python', ['python-flask'])).toBe(false);
    expect(ruleSet.isTagSelectable('python', ['python-django', 'python-flask'])).toBe(false);
    expect(ruleSet.isTagSelectable('python', [])).toBe(true);
    expect(ruleSet.isTagSelectable('javascript', ['reactjs'])).toBe(false);
    expect(ruleSet.isTagSelectable('javascript', [])).toBe(true);
  });

  test('cannot select subtopic when broad tag is selected', () => {
    expect(ruleSet.isTagSelectable('python-django', ['python'])).toBe(false);
    expect(ruleSet.isTagSelectable('python-flask', ['python'])).toBe(false);
    expect(ruleSet.isTagSelectable('reactjs', ['javascript'])).toBe(false);
    expect(ruleSet.isTagSelectable('vuejs', ['javascript'])).toBe(false);
  });

  test('can select broad and subtopic independently if unrelated', () => {
    expect(ruleSet.isTagSelectable('python', ['reactjs'])).toBe(true);
    expect(ruleSet.isTagSelectable('reactjs', ['python'])).toBe(true);
  });

  test('always allows non-broad, non-subtopic tags', () => {
    expect(ruleSet.isTagSelectable('css', ['python'])).toBe(true);
    expect(ruleSet.isTagSelectable('sql', ['vuejs'])).toBe(true);
  });

  test('getSelectableTags filters as expected', () => {
    // python-django selected: python & python-flask filtered, unrelated allowed
    expect(ruleSet.getSelectableTags(
      ['python', 'python-django', 'python-flask', 'javascript', 'css'],
      ['python-django']
    )).toEqual(['python-django', 'javascript', 'css']);

    // broad selected: subtopics filtered
    expect(ruleSet.getSelectableTags(
      ['python', 'python-django', 'python-flask', 'css'],
      ['python']
    )).toEqual(['python', 'css']);
  });
});
