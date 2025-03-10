import { Link as RouterLink, Outlet } from 'react-router-dom';
import { experimentalStyled as styled } from '@mui/material';
import { BoxProps } from '@mui/material';

import Logo from 'src/components/Logo';

const HeaderStyle = styled('header')(({ theme }) => ({
    top: 0,
    left: 0,
    lineHeight: 0,
    width: '100%',
    position: 'absolute',
    padding: theme.spacing(3, 3, 0),
    [ theme.breakpoints.up('sm') ]: {
        padding: theme.spacing(5, 5, 0)
    }
}));

type LogoOnlyLayoutProps = {
    logo_sx?: BoxProps;
    redirect_to?: string;
};

export default function LogoOnlyLayout({ logo_sx, redirect_to = "/" }: LogoOnlyLayoutProps) {
    return (
        <>
            <HeaderStyle>
                <RouterLink to={redirect_to}>
                    <Logo sx={logo_sx} />
                </RouterLink>
            </HeaderStyle>
            <Outlet />
        </>
    );
}
