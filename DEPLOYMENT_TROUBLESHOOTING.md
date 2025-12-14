# Deployment Troubleshooting Guide

If changes to ruarxive.org are not appearing after deployment, follow these steps:

## 1. Verify GitHub Actions Deployment

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. Check the latest workflow run for "Deploy to GitHub Pages"
4. Verify that:
   - The workflow completed successfully (green checkmark)
   - Both `build` and `deploy` jobs completed
   - No errors in the logs

## 2. Check GitHub Pages Environment Configuration

1. Go to **Settings** > **Environments** in your repository
2. Select the `github-pages` environment
3. Under **Deployment branches**, ensure `main` (or `master`) is selected
4. If not configured, add your main branch to allowed deployment branches

## 3. Clear Browser Cache

### Desktop Browsers
- **Chrome/Edge**: Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- **Firefox**: Press `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- **Safari**: Press `Cmd+Option+R` (Mac)

### Mobile Browsers
- Clear browser cache in settings
- Or use incognito/private mode

### Hard Refresh Alternative
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

## 4. Test in Incognito/Private Window

Open ruarxive.org in an incognito/private window to bypass browser cache:
- **Chrome/Edge**: `Ctrl+Shift+N` (Windows/Linux) or `Cmd+Shift+N` (Mac)
- **Firefox**: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- **Safari**: `Cmd+Shift+N` (Mac)

## 5. Check for CDN/Proxy Caching

If you're using a CDN (like Cloudflare) in front of ruarxive.org:

1. **Cloudflare**: 
   - Log into Cloudflare dashboard
   - Go to **Caching** > **Configuration**
   - Click **Purge Everything** or purge specific files
   - Wait a few minutes for cache to clear

2. **Other CDNs**: Check your CDN provider's documentation for cache purging

## 6. Verify DNS and Domain Configuration

1. Check that `CNAME` file in `static/` directory contains: `ruarxive.org`
2. Verify DNS settings point to GitHub Pages
3. Check GitHub Pages settings: **Settings** > **Pages**
   - Source should be set to GitHub Actions
   - Custom domain should show `ruarxive.org`

## 7. Check Build Output

If deployment seems successful but content doesn't update:

1. Check the build logs in GitHub Actions
2. Verify the "Verify build output" step shows files were generated
3. Check file timestamps in the build artifact

## 8. Force a New Deployment

If all else fails, trigger a new deployment:

1. Make a small change (e.g., add a comment to a file)
2. Commit and push to `main` branch
3. This will trigger a new deployment workflow

## 9. Check Deployment Timing

- GitHub Pages deployments can take 1-10 minutes to propagate
- Wait at least 10 minutes after deployment completes
- Check the deployment URL in the Actions logs

## Common Issues

### Issue: Workflow runs but deployment doesn't happen
**Solution**: Check that the `github-pages` environment is configured and allows your branch

### Issue: Build succeeds but site shows old content
**Solution**: 
1. Clear browser cache (see step 3)
2. Check for CDN caching (see step 5)
3. Wait 10 minutes for propagation

### Issue: Changes appear locally but not on live site
**Solution**: 
1. Verify you pushed to `main` branch
2. Check GitHub Actions ran successfully
3. Ensure you're viewing the correct domain (ruarxive.org, not ruarxive.github.io)

## Still Not Working?

If none of these steps resolve the issue:

1. Check GitHub Actions logs for specific error messages
2. Verify the build directory contains expected files
3. Check if there are any build errors or warnings
4. Review the deployment workflow configuration
5. Contact GitHub Support if deployment is consistently failing
