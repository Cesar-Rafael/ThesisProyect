import { Suspense, lazy } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';

import Authenticated from 'src/components/Authenticated';
import BaseLayout from 'src/layouts/BaseLayout';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import accountRoutes from './account';
import baseRoutes from './base';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Members = Loader(lazy(() => import('src/content/blockchain-network/')));
const Students = Loader(lazy(() => import('src/content/students/')));
const Certificates = Loader(lazy(() => import('src/content/certificates/')));
const StudentDetail = Loader(
  lazy(() => import('src/content/students/single/'))
);

const router = [
  {
    path: 'account',
    children: accountRoutes
  },
  {
    path: '*',
    element: <BaseLayout />,
    children: baseRoutes
  },

  // Blockchain Network

  {
    path: 'blockchain-network',
    element: (
      <Authenticated>
        <ExtendedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: 'list',
        element: <Members />
      }
    ]
  },

  // Certificates

  {
    path: 'certificates',
    element: (
      <Authenticated>
        <ExtendedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: 'list',
        element: <Certificates />
      }
    ]
  },

  // Students

  {
    path: 'students',
    element: (
      <Authenticated>
        <ExtendedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: 'list',
        element: <Students />
      },
      {
        path: 'detail/:userId',
        element: <StudentDetail />
      }
    ]
  }
];

export default router;
