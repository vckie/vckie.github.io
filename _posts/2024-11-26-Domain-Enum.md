
### Load Invisishell first

Then Load PowerView by dot sourcing

```bash
. \<path to the script>
```

```bash
. C:\AD\Tools\PowerView.ps1
```
![](https://cdn.vkie.pro/Pasted%20image%2020241107020251.png)

## Domain Enumeration

Get domain gives you info about current forest

```bash
Get-Domain
```
![](https://cdn.vkie.pro/Pasted%20image%2020241107022228.png)

Forest - moneycorp.local
current domain - dollarcopr.moneycorp.local
domain controller 1
domainmodelevel 7 - 2016 server

```bash
Get-DomainSID
```
![](https://cdn.vkie.pro/Pasted%20image%2020241107202057.png)


```bash
Get-Domain-Policy
```
![](https://cdn.vkie.pro/Pasted%20image%2020241108111426.png)



```bash
(Get-DomainPolicy).KerberosPolicy
```


![](https://cdn.vkie.pro/Pasted%20image%2020241108111554.png)


```bash
Get-DomainController
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108112354.png)


## DomainUser Enumeration

To list out the user details
```bash
Get-DomainUser
```


![](https://cdn.vkie.pro/Pasted%20image%2020241108113332.png)


```bash
Get-DomainUser | select samaccountname
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108113737.png)


```bash
Get-DomainUser -identity student315
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108113852.png)

To Find decoy,

```bash
Get-DomainUser | select cn, logoncount
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108114210.png)

```bash
Get-DomainUser -identity student315 -properties *
```
![](https://cdn.vkie.pro/Pasted%20image%2020241108114430.png)

```bash
Get-DomainUser -LDAPFilter "description=*" | select name, description
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108120457.png)


## DomainComputer Enumeration

```bash
Get-DomainComputer
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108120757.png)

```bash
Get-DomainComputer | select samaccountname
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108121041.png)


computer object
 ```bash
 Get-DomainComputer | select cn,logoncount
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108121153.png)

## DomainGroup Enumeration


```bash
Get-DomainGroup
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108121536.png)

```bash
Get-DomainGroup | select name
```
![](https://cdn.vkie.pro/Pasted%20image%2020241108121646.png)

```bash
Get-DomainGroup -Name *admin* | select cn
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108121749.png)

```bash
Get-DomainGroup -Name *admin*  -Domain moneycorp.local | select cn
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108122240.png)

```bash
Get-DomainGroupMember -Identity "Administrators"
```


![](https://cdn.vkie.pro/Pasted%20image%2020241108122535.png)

```bash
Get-DomainGroupMember -Identity "Domain Admins"
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108122546.png)

 sid 500 is default admin account

```bash
Get-DomainGroup -username student315 | select name
```
![](https://cdn.vkie.pro/Pasted%20image%2020241108125650.png)

LocalGroup Enumeration

```bash
Get-NetLocalGroup -ComputerName dcorp-dc
```
for dc no admin rights required to list out the localgroup in dc, but in member machine need admin rights to list out

![](https://cdn.vkie.pro/Pasted%20image%2020241108125951.png)

```bash
Get-NetLocalGroupMember -ComputerName dcorp-dc -GroupName Administrators
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108130239.png)


### Learning Objective 1

```bash
Get-DomainGroupMember -name "Enterprise Admins" -domain moneycorp.local
```

![](https://cdn.vkie.pro/Pasted%20image%2020241108131146.png)


### Domain Group Policy Enumeration


```bash
Get-DomainGPO 
```

![](https://cdn.vkie.pro/Pasted%20image%2020241109024053.png)

```bash
Get-DomainGPO | select displayname
```

![](https://cdn.vkie.pro/Pasted%20image%2020241109024157.png)

```bash
Get-DomainOU
```

![](https://cdn.vkie.pro/Pasted%20image%2020241109031012.png)

```bash
Get-DomainOU | select name,gplink
```

![](https://cdn.vkie.pro/Pasted%20image%2020241109031052.png)

```bash
Get-DomainOU -Identity StudentMachines
```
![](https://cdn.vkie.pro/Pasted%20image%2020241109041225.png)

```bash
(Get-DomainOU -Identity StudentMachines).distinguishedname
```

![](https://cdn.vkie.pro/Pasted%20image%2020241109041328.png)

```bash
(Get-DomainOU -Identity StudentMachines).distinguishedname | %{Get-DomainComputer -SearchBase $_} | select cn
```

![](https://cdn.vkie.pro/Pasted%20image%2020241109041410.png)

### Domain Enumeration - ACL

Whenever the process trying wants to access an object, 
process could have 
	access token (identity & privs of the user)
	 Security Descrtiptors (SID, DACL, SACL)
		
		DACL - list of who have permission & what is the permission
		SACL - audit success or failure



```bash
Get-DomainObjectAcl -SamAccountName student315
```

![](https://cdn.vkie.pro/Pasted%20image%2020241111172836.png)

```bash
Get-DomainObjectAcl -SamAccountName student315 -ResolveGUIDs
```

![](https://cdn.vkie.pro/Pasted%20image%2020241111172836.png)


### Domain Enumeration Trusts

```bash
Get-DomainTrust
```

![](https://cdn.vkie.pro/Pasted%20image%2020241116011213.png)

```bash
Get-DomainTrust -Domain eurocorp.local
```

![](https://cdn.vkie.pro/Pasted%20image%2020241116013336.png)

```bash
Get-Forest
```

![](https://cdn.vkie.pro/Pasted%20image%2020241116012029.png)

```bash
Get-Forest -forest eurocorp.local
```

![](https://cdn.vkie.pro/Pasted%20image%2020241116012207.png)

```bash
Get-ForestDomain
```

![](https://cdn.vkie.pro/Pasted%20image%2020241116012059.png)
```bash
 Get-ForestDomain -Forest eurocorp.local
```
![](https://cdn.vkie.pro/Pasted%20image%2020241116012247.png)
```bash
Get-ForestGlobalCatalog
```

![](https://cdn.vkie.pro/Pasted%20image%2020241116012359.png)

```bash
Get-ForestGlobalCatalog -Forest eurocorp.local
```


![](https://cdn.vkie.pro/Pasted%20image%2020241116012446.png)

```bash
Get-DomainUser -Domain eurocorp.local
```

![](https://cdn.vkie.pro/Pasted%20image%2020241116013725.png)

## All enumeration is valid if trusts is there


### Domain user Hunting

```bash
Find-LocalAdminAccess -verbose
```

![](https://cdn.vkie.pro/Pasted%20image%2020241116014054.png)

who has session on which computer

```bash
Invoke-SessionHunter
```
![](https://cdn.vkie.pro/Pasted%20image%2020241116020443.png)

```bash
Invoke-SessionHunter -CheckAsAdmin
```

![](https://cdn.vkie.pro/Pasted%20image%2020241116020524.png)