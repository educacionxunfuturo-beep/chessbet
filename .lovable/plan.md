

# Confirmacion: Si, es BNB real

**Si.** El smart contract `ChessBet.sol` ya esta diseñado para usar **BNB real** (la criptomoneda nativa de Binance Smart Chain). Cuando un jugador crea o se une a una partida, envia BNB real desde su MetaMask al contrato inteligente. El ganador recibe el pozo completo (menos 2.5% de comision) en BNB real.

El flujo es:
1. Jugador 1 crea partida y envia (por ejemplo) 0.01 BNB real al contrato
2. Jugador 2 se une y envia 0.01 BNB real al contrato
3. El contrato retiene 0.02 BNB hasta que hay ganador
4. El ganador recibe 0.0195 BNB (0.0005 BNB = 2.5% comision)

Las comisiones de red en BSC son ~$0.01-0.05 USD por transaccion.

---

## Lo que falta para que funcione con BNB real

Solo hay **un paso pendiente** que debes hacer tu:

### Desplegar el contrato en BSC

1. Abre [remix.ethereum.org](https://remix.ethereum.org)
2. Crea un archivo, pega el contenido de `contracts/ChessBet.sol`
3. Compila con Solidity 0.8.19
4. Conecta MetaMask (red **BSC Testnet** para probar, o **BSC Mainnet** para produccion)
5. Para testnet: consigue tBNB gratis en [testnet.bnbchain.org/faucet-smart](https://testnet.bnbchain.org/faucet-smart)
6. Haz clic en "Deploy"
7. **Pegame la direccion del contrato** en el chat

Yo actualizo `CONTRACT_ADDRESS` en el codigo y todo queda funcionando con BNB real.

### Despues de eso, el plan de implementacion es:

1. **Actualizar `CONTRACT_ADDRESS`** con la direccion que me des
2. **Agregar soporte USDT BEP-20** al contrato (ChessBetV2) para que tambien se pueda apostar con USDT real en BSC
3. **Matchmaking en tiempo real** — emparejar jugadores automaticamente por monto de apuesta
4. **Conectar Lobby con datos reales** — reemplazar datos mock

Todo usa cripto real en la red BSC.

