import React from 'react';
import { render, mount } from 'enzyme';

import FCCSearchBar from '../src';

describe('<FCCSearchBar />', () => {
  const wrapper = render(<FCCSearchBar />);

  it('should have a form element', () => {
    expect(wrapper.find('form').length).toBe(1);
  });

  it('should have an input element', () => {
    expect(wrapper.find('input').length).toBe(1);
  });

  it('should have a label', () => {
    expect(wrapper.find('label').length).toBe(1);
  });

  it('should be labeled as "Search"', () => {
    expect(wrapper.find('label').text()).toEqual('Search');
  });

  it('the label should have a class of "sr-only"', () => {
    expect(wrapper.find('label').hasClass('sr-only')).toBe(true);
  });

  it('allows an onBlur property to be set', () => {
    const wrapper = mount(<FCCSearchBar onBlur={jest.fn()} />);

    expect(wrapper.props().onBlur).toEqual(expect.any(Function));
  });

  it('calls the onBlur property when the on the blur event', () => {
    const blurSpy = jest.fn();

    const wrapper = mount(<FCCSearchBar onBlur={blurSpy} />);

    expect(blurSpy).not.toHaveBeenCalled();

    const input = wrapper.find('input');
    input.simulate('blur');

    expect(blurSpy).toHaveBeenCalled();
  });

  it('does not call reset member method if onBlur property is included', () => {
    const resetSpy = jest.spyOn(FCCSearchBar.prototype, 'reset');

    const wrapper = mount(<FCCSearchBar onBlur={jest.fn()} />);

    const input = wrapper.find('input');
    input.simulate('blur');

    expect(resetSpy).not.toHaveBeenCalled();
  });
});
