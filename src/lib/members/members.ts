import "server-only";

import { adminDb } from "@/lib/firebase/admin";

export type PublicMemberType =
    | "priest"
    | "sister"
    | "brother"
    | "lay_person";

export type PublicMember = {
    id: string;
    memberId: string;

    type: PublicMemberType;
    title: string;

    firstName: string;
    middleName: string;
    lastName: string;

    designation: string;
    serviceRole: string;

    congregation: string;
    diocese: string;

    photoUrl: string;
    photoPublicId: string;

    ordinationYear: number | null;
    professionYear: number | null;
    joinedParishYear: number | null;

    responsibility: string;

    languages: string[];

    qualification: string;

    bio: string;

    bibleVerse: string;
    bibleReference: string;

    isActive: boolean;
    showOnWebsite: boolean;

    displayOrder: number;
};

export async function getPublicMembers(): Promise<
    PublicMember[]
> {
    const snapshot = await adminDb
        .collection("churchMembers")
        .where("isActive", "==", true)
        .where("showOnWebsite", "==", true)
        .get();

    return snapshot.docs
        .map((doc) => {
            const data = doc.data();

            return {
                id: doc.id,

                memberId:
                    data.memberId ?? "",

                type:
                    data.type ??
                    "lay_person",

                title:
                    data.title ?? "",

                firstName:
                    data.firstName ?? "",

                middleName:
                    data.middleName ?? "",

                lastName:
                    data.lastName ?? "",

                designation:
                    data.designation ?? "",

                serviceRole:
                    data.serviceRole ?? "",

                congregation:
                    data.congregation ?? "",

                diocese:
                    data.diocese ?? "",

                photoUrl:
                    data.photoUrl ?? "",

                photoPublicId:
                    data.photoPublicId ?? "",

                ordinationYear:
                    data.ordinationYear ??
                    null,

                professionYear:
                    data.professionYear ??
                    null,

                joinedParishYear:
                    data.joinedParishYear ??
                    null,

                responsibility:
                    data.responsibility ?? "",

                languages:
                    Array.isArray(
                        data.languages
                    )
                        ? data.languages
                        : [],

                qualification:
                    data.qualification ?? "",

                bio:
                    data.bio ?? "",

                bibleVerse:
                    data.bibleVerse ?? "",

                bibleReference:
                    data.bibleReference ?? "",

                isActive:
                    data.isActive === true,

                showOnWebsite:
                    data.showOnWebsite === true,

                displayOrder:
                    Number(
                        data.displayOrder ?? 0
                    ),
            };
        })
        .sort(
            (a, b) =>
                a.displayOrder -
                b.displayOrder
        );
}

export async function getPublicMember(
    id: string
): Promise<PublicMember | null> {
    const doc = await adminDb
        .collection("churchMembers")
        .doc(id)
        .get();

    if (!doc.exists) {
        return null;
    }

    const data = doc.data();

    if (!data) {
        return null;
    }

    const member: PublicMember = {
        id: doc.id,

        memberId:
            data.memberId ?? "",

        type:
            data.type ??
            "lay_person",

        title:
            data.title ?? "",

        firstName:
            data.firstName ?? "",

        middleName:
            data.middleName ?? "",

        lastName:
            data.lastName ?? "",

        designation:
            data.designation ?? "",

        serviceRole:
            data.serviceRole ?? "",

        congregation:
            data.congregation ?? "",

        diocese:
            data.diocese ?? "",

        photoUrl:
            data.photoUrl ?? "",

        photoPublicId:
            data.photoPublicId ?? "",

        ordinationYear:
            data.ordinationYear ??
            null,

        professionYear:
            data.professionYear ??
            null,

        joinedParishYear:
            data.joinedParishYear ??
            null,

        responsibility:
            data.responsibility ?? "",

        languages:
            Array.isArray(data.languages)
                ? data.languages
                : [],

        qualification:
            data.qualification ?? "",

        bio:
            data.bio ?? "",

        bibleVerse:
            data.bibleVerse ?? "",

        bibleReference:
            data.bibleReference ?? "",

        isActive:
            data.isActive === true,

        showOnWebsite:
            data.showOnWebsite === true,

        displayOrder:
            Number(
                data.displayOrder ?? 0
            ),
    };

    if (
        member.isActive !== true ||
        member.showOnWebsite !== true
    ) {
        return null;
    }

    return member;
}