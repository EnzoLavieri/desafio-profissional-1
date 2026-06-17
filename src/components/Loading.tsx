import { LoaderCircle } from 'lucide-react';

function Loading() {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <LoaderCircle className="animate-spin w-16 h-16 text-orange-500" />
            <p>Carregando empresas</p>
        </div>
    )
}

export default Loading