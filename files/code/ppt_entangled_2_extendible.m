e0=[1;0;0]; e1=[0;1;0]; e2=[0;0;1];
E0 = e0*e0'; E1 = e1*e1'; E2 = e2*e2';

psi = (kron(e0,e0)+kron(e1,e1)+kron(e2,e2))/sqrt(3);
S = (kron(E0,E1)+kron(E1,E2)+kron(E2,E0))/3;
T = (kron(E1,E0)+kron(E2,E1')+kron(E0,E2))/3;
a = 7/2;
rho = 2/7*(psi*psi')+a/7*S+(5-a)/7*T;

IsPPT(rho)
~IsSeparable(rho)

chi0 = kron(e0,kron(e0,e0))+kron(e1,(kron(e0,e1)+kron(e1,e0))) + ...
    kron(e2,(kron(e0,e2)+kron(e2,e0)));
chi1 = kron(e0,(kron(e0,e1)+kron(e1,e0)))+kron(e1,kron(e1,e1)) + ...
    kron(e2,(kron(e1,e2)+kron(e2,e1)));
chi2 = kron(e0,(kron(e0,e2)+kron(e2,e0)))+kron(e1,(kron(e1,e2)+kron(e2,e1))) + ...
    kron(e2,kron(e2,e2));

Omega = 2/63*(chi0*chi0'+chi1*chi1'+chi2*chi2') + ...
    17/126*(kron(E0,kron(E1,E1))+kron(E1,kron(E2,E2))+kron(E2,kron(E0,E0))) + ...
    5/126*(kron(E1,kron(E0,E0))+kron(E2,kron(E1,E1))+kron(E0,kron(E2,E2)));

norm(PartialTrace(Omega,2,[3,3,3])-rho)
norm(PartialTrace(Omega,3,[3,3,3])-rho)