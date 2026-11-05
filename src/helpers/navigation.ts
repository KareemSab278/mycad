import { Href, useLocalSearchParams, useRouter } from 'expo-router';

type NavigationParams = Record<
    string,
    string | number | boolean | (string | number)[] | null
>;

type NavigateOptions = {
    params?: NavigationParams;
    onNavigate?: () => void;
};

export const useNav = () => {
    const router = useRouter();
    const receivedParams = useLocalSearchParams();

    const to = (screen: Href, options?: NavigateOptions) => {
        const { params, onNavigate } = options ?? {};

        let destination = screen;
        if (params && Object.keys(params).length > 0) {
            const queryParams = Object.fromEntries(
                Object.entries(params).map(([key, value]) => [
                    key,
                    value === null || typeof value === 'boolean'
                        ? String(value)
                        : value,
                ])
            );
            destination = {
                pathname: screen as never,
                params: queryParams,
            };
        }

        router.push(destination);
        onNavigate?.();
    };

    const replace = (screen: Href, options?: NavigateOptions) => {
        const { params, onNavigate } = options ?? {};

        let destination = screen;
        if (params && Object.keys(params).length > 0) {
            const queryParams = Object.fromEntries(
                Object.entries(params).map(([key, value]) => [
                    key,
                    value === null || typeof value === 'boolean'
                        ? String(value)
                        : value,
                ])
            );
            destination = {
                pathname: screen as never,  
                params: queryParams,
            };
        }

        router.replace(destination);
        onNavigate?.();
    };

    const from = <T,>(callback: (params: T) => void) => {
        callback(receivedParams as T);
    };

    const back = () => {
        if (router.canGoBack()) {
            router.back();
            return;
        }

        router.replace('/');
    };

    return { to, from, back, replace };
};

/*
    use like:

    // no params needed
    const nav = useNav();
    nav.to('/Home');


    <Buttons.Primary
        onPress={() => nav.to('/Settings')}
        label="Open Settings"
    />

    nav.to('/Machines', {
        params: {
            machine_id: 3,
        },
    });

    // then:
    const [machine, setMachine] = useState<Machine | null>(null);
    useEffect(() => {
        nav.from<{ machine_id?: string }>((params) => {
            if (params.machine_id) {
                fetchMachine(params.machine_id).then(setMachine);
            }
        });
    }, []);


    nav.to('/Settings', {
        onNavigate: () => {
            console.log('Navigation triggered');
        },
    });

*/