package com.redflix.tv.fragments

import android.os.Bundle
import android.view.View
import androidx.leanback.app.BrowseSupportFragment
import androidx.leanback.widget.*
import com.redflix.tv.R
import com.redflix.tv.models.Content
import com.redflix.tv.presenters.CardPresenter

class MainFragment : BrowseSupportFragment() {
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupUIElements()
        loadRows()
        setupEventListeners()
    }
    
    private fun setupUIElements() {
        title = getString(R.string.browse_title)
        headersState = HEADERS_ENABLED
        isHeadersTransitionOnBackEnabled = true
        brandColor = resources.getColor(R.color.primary, null)
        searchAffordanceColor = resources.getColor(R.color.accent, null)
    }
    
    private fun loadRows() {
        val rowsAdapter = ArrayObjectAdapter(ListRowPresenter())
        val cardPresenter = CardPresenter()
        
        // Continue Watching Row
        val continueWatchingAdapter = ArrayObjectAdapter(cardPresenter)
        val continueWatchingHeader = HeaderItem(0, getString(R.string.continue_watching))
        rowsAdapter.add(ListRow(continueWatchingHeader, continueWatchingAdapter))
        
        // Popular Movies Row
        val moviesAdapter = ArrayObjectAdapter(cardPresenter)
        val moviesHeader = HeaderItem(1, getString(R.string.popular_movies))
        rowsAdapter.add(ListRow(moviesHeader, moviesAdapter))
        
        // Popular Series Row
        val seriesAdapter = ArrayObjectAdapter(cardPresenter)
        val seriesHeader = HeaderItem(2, getString(R.string.popular_series))
        rowsAdapter.add(ListRow(seriesHeader, seriesAdapter))
        
        // Live Channels Row
        val channelsAdapter = ArrayObjectAdapter(cardPresenter)
        val channelsHeader = HeaderItem(3, getString(R.string.live_channels))
        rowsAdapter.add(ListRow(channelsHeader, channelsAdapter))
        
        adapter = rowsAdapter
    }
    
    private fun setupEventListeners() {
        setOnSearchClickedListener {
            // Open search activity
        }
        
        onItemViewClickedListener = OnItemViewClickedListener { _, item, _, _ ->
            if (item is Content) {
                // Navigate to content details or play
            }
        }
        
        onItemViewSelectedListener = OnItemViewSelectedListener { _, item, _, _ ->
            // Update background or show preview
        }
    }
}
