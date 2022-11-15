import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import SchoolIcon from '@mui/icons-material/School';

const menuItems = [
  {
    heading: 'General',
    items: [
      {
        name: 'Red Blockchain',
        icon: PeopleAltIcon,
        link: '/blockchain-network/list'
      },
      {
        name: 'Certificados',
        icon: CardMembershipIcon,
        link: '/certificates/list'
      },
      {
        name: 'Estudiantes',
        icon: SchoolIcon,
        link: '/students/list'
      }
    ]
  },
  /*
  {
    heading: 'Management',
    items: [
      {
        name: 'Users',
        icon: AssignmentIndTwoToneIcon,
        link: '/extended-sidebar/management/users',
        items: [
          {
            name: 'List',
            link: 'management/users/list'
          },
          {
            name: 'User Profile',
            link: 'management/users/single'
          }
        ]
      },
      {
        name: 'Projects',
        icon: AccountTreeTwoToneIcon,
        link: '/extended-sidebar/management/projects/list'
      },
      {
        name: 'Commerce',
        icon: StorefrontTwoToneIcon,
        link: '/extended-sidebar/management/commerce',
        items: [
          {
            name: 'Shop',
            link: 'management/commerce/shop'
          },
          {
            name: 'List',
            link: 'management/commerce/products/list'
          },
          {
            name: 'Details',
            link: 'management/commerce/products/single/1'
          },
          {
            name: 'Create',
            link: 'management/commerce/products/create'
          }
        ]
      },
      {
        name: 'Invoices',
        icon: ReceiptTwoToneIcon,
        link: '/extended-sidebar/management/invoices',
        items: [
          {
            name: 'List',
            link: 'management/invoices/list'
          },
          {
            name: 'Details',
            link: 'management/invoices/single'
          }
        ]
      }
    ]
  },
  {
    heading: 'Extra Pages',
    items: [
      {
        name: 'Auth Pages',
        icon: VpnKeyTwoToneIcon,
        link: '/auth',
        items: [
          {
            name: 'Login',
            items: [
              {
                name: 'Basic',
                link: '/account/login-basic'
              },
              {
                name: 'Cover',
                link: '/account/login-cover'
              }
            ]
          },
          {
            name: 'Register',
            items: [
              {
                name: 'Basic',
                link: '/account/register-basic'
              },
              {
                name: 'Cover',
                link: '/account/register-cover'
              },
              {
                name: 'Wizard',
                link: '/account/register-wizard'
              }
            ]
          },
          {
            name: 'Recover Password',
            link: '/account/recover-password'
          }
        ]
      },
      {
        name: 'Status',
        icon: ErrorTwoToneIcon,
        link: '/status',
        items: [
          {
            name: 'Error 404',
            link: '/status/404'
          },
          {
            name: 'Error 500',
            link: '/status/500'
          },
          {
            name: 'Maintenance',
            link: '/status/maintenance'
          },
          {
            name: 'Coming Soon',
            link: '/status/coming-soon'
          }
        ]
      }
    ]
  },
  {
    heading: 'Foundation',
    items: [
      {
        name: 'Overview',
        link: '/overview',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Documentation',
        icon: SupportTwoToneIcon,
        link: '/docs'
      }
    ]
  }
  */
];

export default menuItems;
