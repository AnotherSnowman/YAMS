// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActorCard, ActorRatingView } from './_ActorRating';
import React from 'react';

import { apiCallForRoleImages } from './_ImageSearchApiCalls';
import axios from 'axios';

jest.mock('axios');
const axiosGetMock = axios.get;

jest.mock('./_ImageSearchApiCalls');
const apiCallForRoleImagesMock = apiCallForRoleImages;

beforeEach(() => {
  axiosGetMock.mockReset();
});

describe('ActorCard', () => {
  apiCallForRoleImagesMock.mockReturnValue("Whatever!");
  // Mock data
  const actor = {
    name: 'John Doe',
    roles: [
      {
        movieDetails: {
          title: 'Movie 1',
          seen: true
        },
        role: 'Role 1'
      },
      {
        movieDetails: {
          title: 'Movie 2',
          seen: true
        },
        role: 'Role 2'
      }
    ]
  };

  it('should render actor name and roles in seen movies', () => {

    // Render ActorCard component
    render(<ActorCard actor={actor} />);

    // Assert
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Seen in:')).toBeInTheDocument();
    expect(screen.getByText('Movie 1:')).toBeInTheDocument();
    expect(screen.getByText('Role 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 2:')).toBeInTheDocument();
    expect(screen.getByText('Role 2')).toBeInTheDocument();
    expect(screen.getByText('Role 2')).toBeInTheDocument();
  });
  it('should set actor rating in allChanges object when rating is changed', async () => {

    // Mock allChanges object
    let allChanges = {
      ratings: {},
      images: {}
    };

    const user = userEvent.setup();
    // Render ActorCard component
    render(<ActorCard actor={actor} allChanges={allChanges} />);

    // Simulate rating change
    await user.click(screen.getByLabelText('❤️‍🔥'));

    // Assert
    expect(allChanges.ratings[actor.id]).toBe('5');
  });

  // Skipping this for now. Current challenges:
  // 1. Understand to which degree the parts of the component in test scope get mocked / executed.
  // E.g. It seems that the useEffect hook is not happening in test mode, and such the API call to fetch actor images as well not.
  // 2.1 Get the useEffect hook executed, 
  // 2.2 mock axios API call (or rather _ImageSearchApiCalls function), 
  // 2.3 test that the API reponse ends up in the DOM.
  // TODO 

});

describe('ActorRatingView', () => {
  // TODO: TBD
});