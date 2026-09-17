import type {SubNavItem} from '../../components/sidebar.types'

export const TALENT_HUB_SUB_NAV:SubNavItem[] = [
    {label:'Attendance',path:'attendance',
        children:[
            {label:'Configuration',path:'configuration'},
            {label:'Integration',path:'integration'}
        ]
    },
    {label:'Leave',path:'leave',
        children:[
            {label:'Settings',path:'settings'},
            {label:'Holiday & Weekly Off',path:'holidayandweekOff'},
            {label:'Adjustment',path:'adjustment'},
            {label:'Daily',path:'daily'},
            {label:'ForceLeaveApproval',path:'forceleaveapproval'},
            {label:'Report',path:'report'},
        ]
    },
    {label:'TimeOffice',path:'timeoffice'}
]