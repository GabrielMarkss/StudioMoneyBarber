// dias-utils.ts
export function gerarProximosDiasUteis(): { label: string; dia: string; data: string }[] {
    const dias = [];
    const hoje = new Date();
    for (let i = 0; i < 6; i++) {
        const data = new Date();
        data.setDate(hoje.getDate() + i);
        const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
        if (diaSemana !== 'DOM.') {
            dias.push({
                label: diaSemana.replace('.', ''), // SEG, TER, etc.
                dia: data.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase(),
                data: data.toLocaleDateString('pt-BR'),
            });
        }
    }
    return dias;
}
