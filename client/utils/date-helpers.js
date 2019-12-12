import { formatRelative } from 'date-fns';

export const formatDate = resource => {
    return formatRelative(new Date(resource.createdAt), new Date());
};
