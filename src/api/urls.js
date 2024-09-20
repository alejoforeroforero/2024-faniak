
const prefix = '/api/v1/'

export default {
    createCredit: () => `${prefix}drive/create_credit`,
    updateCredit: () => `${prefix}drive/update_credit`,
    deleteCredit: () => `${prefix}drive/delete_credit`,

    createFolder: () => `${prefix}drive/create_folder`,
    updateFolder: () => `${prefix}drive/update_folder`,

    createRelation: () => `${prefix}drive/create_relation`,
    updateRelation: () => `${prefix}drive/update_relation`,
    deleteRelation: () => `${prefix}drive/delete_relation`,

    getFolder:              () => `${prefix}drive/get_folder`,
    getFolderRelationships: () => `${prefix}drive/get_folder_relationships`,
    getFolderCredits:       () => `${prefix}drive/get_credits`,
    addAlbumsAndSongs:      () => `${prefix}drive/add_albums_and_songs`,

    //drive
    getFile:                () => `${prefix}drive/get_file`,
    getFiles:               () => `${prefix}drive/get_files`,
    getThumbnails:          () => `${prefix}drive/get_thumbnails`,
    getStorageQuota:        () => `${prefix}drive/get_storage_quota`,
    createFile:             () => `${prefix}drive/create_file`,
    updateFile:             () => `${prefix}drive/update_file`,
    updateFiles:            () => `${prefix}drive/update_files`,
    exportFile:             () => `${prefix}drive/export_file`,
    createPermission:       () => `${prefix}drive/create_permission`,
    updatePermission:       () => `${prefix}drive/update_permission`,
    deletePermission:       () => `${prefix}drive/delete_permission`,

    migrateLegacyGig:       () => `${prefix}drive/migrate_legacy_gig`,

    // calendar
    getEvent:               () => `${prefix}drive/get_event`,
    getMyEvents:            () => `${prefix}drive/get_my_events`,
    getMyCalendars:         () => `${prefix}drive/get_my_calendars`,
    createEvent:            () => `${prefix}drive/create_event`,
    updateEvent:            () => `${prefix}drive/update_event`,

    // people
    searchContacts:         () => `${prefix}drive/search_contacts`,
    listDirectoryContacts:  () => `${prefix}drive/list_directory_contacts`,

    heartbeat:          () => `${prefix}team/heartbeat`,
    getMyProfile:       () => `${prefix}team/get_my_profile`,
    getMember:          () => `${prefix}team/get_member`,
    updateMember:       () => `${prefix}team/update_member`,
    getMemberByEmail:   () => `${prefix}team/get_member_by_email`,
    addEmployee:        () => `${prefix}team/add_employee`,
    updateEmployee:     () => `${prefix}team/update_employee`,
    removeEmployee:     () => `${prefix}team/remove_employee`,
    openNotification:   () => `${prefix}team/open_notification`,

    openCustomerPortal:     () => `${prefix}payment/create_customer_portal_session`,
    createCheckoutSession:  () => `${prefix}payment/create_checkout_session`,

    getMyCredentials:       () => `${prefix}auth/get_my_credentials`,
    authorizeGoogleAccount: () => `${prefix}auth/authorize_google_account`,

    getSpotifyReleases:     () => `${prefix}connections/get_spotify_albums`,
    getSpotifyMetadata:     () => `${prefix}connections/get_spotify_albums_and_tracks`,
    getSpotifySong:         () => `${prefix}connections/get_spotify_track`,
    searchInternet:         () => `${prefix}connections/search`,
    searchExternalArtists:  () => `${prefix}connections/search_artists`,

    buildDocument: (type) => `${prefix}documents/build_${type}`,

    logUserEvent: () => `${prefix}metrics/log_user_event`,
    
    registerGoogle: () => `${prefix}auth/register_using_google_account`,
}