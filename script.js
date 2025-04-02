const contractAddress = "0xYourContractAddress";  // Dirección de tu contrato BAI
const abi = [...]  // ABI del contrato (lo puedes obtener desde Remix o Etherscan)

async function connectMetamask() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();
        console.log("Connected to:", await signer.getAddress());
        document.getElementById('connectButton').disabled = true;  // Desactiva el botón
    } else {
        alert("Please install MetaMask to connect.");
    }
}

async function buyBAI() {
    const ethAmount = document.getElementById("ethAmount").value;
    if (ethAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Convertir ETH a Wei y realizar la transacción
    const amountInWei = ethers.utils.parseEther(ethAmount.toString());
    const tx = await contract.buyBAI({ value: amountInWei });
    await tx.wait();

    alert("Compra realizada con éxito");
}

async function updateSupply() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const circulatingSupply = await contract.circulatingSupply();
    const totalSupply = await contract.totalSupply();
    const percentageBurned = ((totalSupply - circulatingSupply) / totalSupply) * 100;

    // Actualiza el contador en la página
    document.getElementById('circulatingSupply').innerText = `Circulating Supply: ${circulatingSupply}`;
    document.getElementById('burnBar').style.width = `${percentageBurned}%`;  // Actualiza la barra
}

// Llamar a la función de actualización al cargar la página
window.onload = updateSupply;