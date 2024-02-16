export function sampleArr<T>(arr: T[], frac: number = 0.5) {
    const sampling_pool = [...arr];
    const sample_list: T[] = [];
    for (let i = 0; i < Math.floor(arr.length * (1-frac)); i++) {
        const randomIndex:number = Math.floor(Math.random() * sampling_pool.length);
        sample_list.push(sampling_pool[randomIndex]);
        sampling_pool.splice(randomIndex, 1);
    }
    return sample_list;
}