export type ProjectDetails = {
    address: string;
    projectStarter: string;
    minContribution: string;
    deadline: Date;
    goalAmount: string;
    completedTime: Date;
    currentAmount: string;
    title: string;
    description: string;
    state: string;
    balance: string;
};

export type ProjectDonation = {
    projectAddress: string;
    contributedAmount: string;
    contributor: string;
}